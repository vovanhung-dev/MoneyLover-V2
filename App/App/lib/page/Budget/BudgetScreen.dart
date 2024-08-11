import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shoehubapp/data/api.dart';

import '../../data/BudgetAPI.dart';
import '../../model/Budget.dart';

class BudgetScreen extends StatefulWidget {
  @override
  _BudgetScreenState createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  late BudgetAPI budgetAPI;
  late Future<List<Budget>> _budgetsFuture;

  @override
  void initState() {
    super.initState();
    budgetAPI = BudgetAPI(API()); // Initialize Dio and BudgetAPI
    _budgetsFuture = budgetAPI.getBudgets(); // Fetch all budgets
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Budgets'),
      ),
      body: FutureBuilder<List<Budget>>(
        future: _budgetsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No budgets available.'));
          } else {
            final budgets = snapshot.data!;
            return ListView.builder(
              itemCount: budgets.length,
              itemBuilder: (context, index) {
                final budget = budgets[index];
                return ListTile(
                  title: Text(budget.name),
                  subtitle: Text('Amount: ${budget.amount}'),
                  onTap: () {
                    // Handle budget tap if needed
                  },
                );
              },
            );
          }
        },
      ),
    );
  }
}
