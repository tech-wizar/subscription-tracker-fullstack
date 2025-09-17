package com.mytracker.subscriptiontrackerapi.service;

import com.mytracker.subscriptiontrackerapi.model.BillingCycle;
import com.mytracker.subscriptiontrackerapi.model.Subscription;
import com.mytracker.subscriptiontrackerapi.model.User;
import com.mytracker.subscriptiontrackerapi.repository.SubscriptionRepository;
import com.mytracker.subscriptiontrackerapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO;
import com.mytracker.subscriptiontrackerapi.dto.UpcomingBillDTO;
import com.mytracker.subscriptiontrackerapi.dto.MonthlyExpenseDTO;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Map;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    // --- LEGACY METHOD ---
    public List<Subscription> getAllSubscriptions() {
        return getAllSubscriptions(null, null, null);
    }

    // --- NEW DYNAMIC METHOD FOR SORTING AND FILTERING ---
    public List<Subscription> getAllSubscriptions(String sortBy, String sortDirection, String filterByCycle) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found in database"));

        Specification<Subscription> spec = (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get("user").get("id"), currentUser.getId());

        if (filterByCycle != null && !filterByCycle.isEmpty()) {
            try {
                BillingCycle cycle = BillingCycle.valueOf(filterByCycle.toUpperCase());
                Specification<Subscription> filterSpec = (root, query, criteriaBuilder) -> criteriaBuilder
                        .equal(root.get("billingCycle"), cycle);
                spec = spec.and(filterSpec);
            } catch (IllegalArgumentException ignored) {
            }
        }

        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy != null ? sortBy : "startDate");

        return subscriptionRepository.findAll(spec, sort);
    }

    // ✅ Modified: Trigger budget check after saving
    public Subscription addSubscription(Subscription subscription) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        subscription.setUser(user);
        Subscription saved = subscriptionRepository.save(subscription);

        // check budget after adding
        checkBudgetAndSendAlert();

        return saved;
    }

    public void deleteSubscription(Long id) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found in database"));

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));

        if (!Objects.equals(subscription.getUser().getId(), currentUser.getId())) {
            throw new SecurityException("User is not authorized to delete this subscription");
        }

        subscriptionRepository.deleteById(id);
    }

    // ✅ Modified: Trigger budget check after updating
    public Subscription updateSubscription(Long id, Subscription subscriptionDetails) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found in database"));

        Subscription existingSubscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));

        if (!Objects.equals(existingSubscription.getUser().getId(), currentUser.getId())) {
            throw new SecurityException("User is not authorized to update this subscription");
        }

        existingSubscription.setName(subscriptionDetails.getName());
        existingSubscription.setCategory(subscriptionDetails.getCategory());
        existingSubscription.setCost(subscriptionDetails.getCost());
        existingSubscription.setBillingCycle(subscriptionDetails.getBillingCycle());
        existingSubscription.setStartDate(subscriptionDetails.getStartDate());

        Subscription updated = subscriptionRepository.save(existingSubscription);

        // check budget after update
        checkBudgetAndSendAlert();

        return updated;
    }

    public List<CategoryExpenseDTO> getExpenseSummary() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found in database"));

        return subscriptionRepository.getCategoryExpensesByUserId(currentUser.getId());
    }

    public List<UpcomingBillDTO> getUpcomingBills() {
        List<Subscription> userSubscriptions = getAllSubscriptions();
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        List<UpcomingBillDTO> upcomingBills = new ArrayList<>();

        for (Subscription sub : userSubscriptions) {
            LocalDate nextBillingDate = calculateNextBillingDate(sub);

            boolean isOnOrAfterToday = !nextBillingDate.isBefore(today);
            boolean isBeforeTheLimit = nextBillingDate.isBefore(thirtyDaysFromNow);

            if (isOnOrAfterToday && isBeforeTheLimit) {
                upcomingBills.add(new UpcomingBillDTO(sub.getName(), sub.getCost(), nextBillingDate));
            }
        }
        return upcomingBills;
    }

    private LocalDate calculateNextBillingDate(Subscription sub) {
        LocalDate nextDate = sub.getStartDate();
        LocalDate today = LocalDate.now();

        if (nextDate.isAfter(today)) {
            return nextDate;
        }

        if (sub.getBillingCycle() == BillingCycle.MONTHLY) {
            while (!nextDate.isAfter(today)) {
                nextDate = nextDate.plusMonths(1);
            }
        } else if (sub.getBillingCycle() == BillingCycle.YEARLY) {
            while (!nextDate.isAfter(today)) {
                nextDate = nextDate.plusYears(1);
            }
        }
        return nextDate;
    }

    public List<MonthlyExpenseDTO> getMonthlyExpenseHistory() {
        List<Subscription> userSubscriptions = getAllSubscriptions();
        LocalDate today = LocalDate.now();

        return IntStream.range(0, 12)
                .mapToObj(i -> YearMonth.from(today.minusMonths(i)))
                .map(yearMonth -> {
                    BigDecimal monthlyTotal = userSubscriptions.stream()
                            .filter(sub -> {
                                YearMonth startYm = YearMonth.from(sub.getStartDate());
                                return !startYm.isAfter(yearMonth);
                            })
                            .map(sub -> {
                                if (sub.getBillingCycle() == BillingCycle.YEARLY) {
                                    return sub.getCost().divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);
                                }
                                return sub.getCost();
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    String monthLabel = yearMonth.format(DateTimeFormatter.ofPattern("MMM yyyy"));
                    return new MonthlyExpenseDTO(monthLabel, monthlyTotal);
                })
                .collect(Collectors.toList());
    }

    public BigDecimal getCurrentMonthSpending() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found in DB"));

        List<Subscription> userSubscriptions = subscriptionRepository.findByUserId(currentUser.getId());
        YearMonth thisMonth = YearMonth.now();

        return userSubscriptions.stream()
                .filter(sub -> !YearMonth.from(sub.getStartDate()).isAfter(thisMonth))
                .map(sub -> {
                    if (sub.getBillingCycle() == BillingCycle.YEARLY) {
                        return sub.getCost().divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);
                    }
                    return sub.getCost();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ✅ Budget alert logic
    public void checkBudgetAndSendAlert() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getMonthlyBudget() == null)
            return;

        BigDecimal spent = getCurrentMonthSpending();
        BigDecimal budget = user.getMonthlyBudget();

        if (spent.compareTo(budget) >= 0) {
            emailService.sendBudgetAlert(user.getEmail(), spent, budget);
        }
    }

    public void checkBudgetAndSendAlert(BigDecimal spending) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getMonthlyBudget() == null)
            return;

        BigDecimal budget = user.getMonthlyBudget();

        if (spending.compareTo(budget) >= 0) {
            emailService.sendBudgetAlert(user.getEmail(), spending, budget);
        }
    }

    public String generateMonthlyDetailedCSV() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found in DB"));

        // Fetch only current user's subscriptions
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(currentUser.getId());

        if (subscriptions.isEmpty()) {
            return "No subscriptions found for user: " + userEmail;
        }

        // Group by month-year
        Map<String, List<Subscription>> groupedByMonth = subscriptions.stream()
                .collect(Collectors.groupingBy(
                        sub -> sub.getStartDate().getMonth().toString() + " " + sub.getStartDate().getYear()));

        StringBuilder sb = new StringBuilder();

        for (Map.Entry<String, List<Subscription>> entry : groupedByMonth.entrySet()) {
            String monthYear = entry.getKey();
            List<Subscription> subs = entry.getValue();

            sb.append("Month: ").append(monthYear).append("\n");
            sb.append("Name,Category,Cost,Billing Cycle,Start Date\n");

            BigDecimal total = BigDecimal.ZERO;
            for (Subscription sub : subs) {
                sb.append(sub.getName()).append(",")
                        .append(sub.getCategory()).append(",")
                        .append("₹ ").append(sub.getCost()).append(",")
                        .append(sub.getBillingCycle()).append(",")
                        .append(sub.getStartDate()).append("\n");

                total = total.add(sub.getCost());
            }

            // Add total row
            sb.append("Total,,₹ ").append(total).append(",,\n\n");
        }

        return sb.toString();
    }

}
