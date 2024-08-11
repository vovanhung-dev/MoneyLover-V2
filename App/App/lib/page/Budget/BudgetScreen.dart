import 'package:flutter/material.dart';
import 'package:shoehubapp/data/api.dart';
import 'package:shoehubapp/data/BudgetAPI.dart';
import 'package:shoehubapp/model/Budget.dart';
import '../../data/CategoryAPI.dart';
import '../../data/WalletAPI.dart';
import 'CreateBudgetScreen.dart';

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
    budgetAPI = BudgetAPI(API()); // Khởi tạo API và BudgetAPI
    _fetchBudgets(); // Lấy tất cả ngân sách
  }

  Future<void> _fetchBudgets() async {
    setState(() {
      _budgetsFuture = budgetAPI.getBudgets();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Budgets'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CreateBudgetScreen(
                    budgetAPI: budgetAPI,
                    categoryAPI: CategoryAPI(API()), // Thay thế bằng API đúng
                    walletAPI: WalletAPI(API()), // Thay thế bằng API đúng
                  ),
                ),
              );
              _fetchBudgets(); // Cập nhật danh sách sau khi tạo mới
            },
          ),
        ],
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
                    // Xử lý khi nhấn vào ngân sách, nếu cần
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
