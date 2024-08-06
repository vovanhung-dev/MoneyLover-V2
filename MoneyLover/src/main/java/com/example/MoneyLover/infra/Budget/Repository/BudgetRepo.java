package com.example.MoneyLover.infra.Budget.Repository;

import com.example.MoneyLover.infra.Budget.Dto.Budget_response;
import com.example.MoneyLover.infra.Budget.Entity.Budget;
import com.example.MoneyLover.infra.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BudgetRepo extends JpaRepository<Budget,String> {

    @Query("select new com.example.MoneyLover.infra.Budget.Dto.Budget_response(b.id ,b.category,b.amount,b.period_start,b.period_end,b.repeat_bud,b.name,b.wallet.id) from Budget b where b.user=?1 AND (?2 IS NULL OR b.wallet.id = ?2) and b.period_end >?3")
    List<Budget_response> findAllByUser(User user, String wallet, LocalDate today);

    @Query("select new com.example.MoneyLover.infra.Budget.Dto.Budget_response(b.id ,b.category,b.amount,b.period_start,b.period_end,b.repeat_bud,b.name,b.wallet.id) from Budget b where b.user=?1 AND (?2 IS NULL OR b.wallet.id = ?2) and b.period_end <=?3")
    List<Budget_response> findAllByUserExpired(User user, String wallet, LocalDate today);


    @Query("select new com.example.MoneyLover.infra.Budget.Dto.Budget_response(b.id ,b.category,b.amount,b.period_start,b.period_end,b.repeat_bud,b.name,b.wallet.id) from Budget b where b.user=?1")
    List<Budget_response> findAllByUserWithoutWallet(User user);

}
