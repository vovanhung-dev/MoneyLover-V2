import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:shoehubapp/data/api.dart';
import 'package:shoehubapp/data/BudgetAPI.dart';
import 'package:shoehubapp/model/Budget.dart';
import '../../data/CategoryAPI.dart';
import '../../data/WalletAPI.dart';
import '../../model/Wallet.dart';
import 'CreateBudgetScreen.dart';

class BudgetScreen extends StatefulWidget {
  @override
  _BudgetScreenState createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  late BudgetAPI budgetAPI;
  late WalletAPI walletAPI;
  String? _selectedWalletId;
  late Future<List<Budget>> _budgetsFuture;
  late Future<List<Wallet>> _walletsFuture;

  @override
  void initState() {
    super.initState();
    budgetAPI = BudgetAPI(API());
    walletAPI = WalletAPI(API());
    _walletsFuture = _fetchWallets();
    _budgetsFuture = Future.value([]);
  }

  Future<List<Wallet>> _fetchWallets() async {
    final walletResponse = await walletAPI.getWallets(0);
    return walletResponse.data.content;
  }

  Future<void> _fetchBudgets() async {
    if (_selectedWalletId != null) {
      setState(() {
        _budgetsFuture = budgetAPI.getBudgets(_selectedWalletId!);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurpleAccent, // Sử dụng màu sắc tươi sáng
        title: const Text('Budgets', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: Icon(Icons.add, size: 30, color: Colors.white),
            onPressed: () async {
              if (_selectedWalletId != null) {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CreateBudgetScreen(
                      budgetAPI: budgetAPI,
                      categoryAPI: CategoryAPI(API()),
                      walletAPI: walletAPI,
                    ),
                  ),
                );
                _fetchBudgets();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Please select a wallet first.')),
                );
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          FutureBuilder<List<Wallet>>(
            future: _walletsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const Center(child: Text('No wallets available.'));
              } else {
                final wallets = snapshot.data!;
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: DropdownButton<String>(
                    hint: Text('Select a wallet', style: TextStyle(color: Colors.deepPurpleAccent)),
                    value: _selectedWalletId,
                    items: wallets.map((wallet) {
                      return DropdownMenuItem<String>(
                        value: wallet.id,
                        child: Text(wallet.name),
                      );
                    }).toList(),
                    onChanged: (newValue) {
                      setState(() {
                        _selectedWalletId = newValue;
                        _fetchBudgets();
                      });
                    },
                    isExpanded: true,
                    style: TextStyle(color: Colors.deepPurpleAccent),
                  ),
                );
              }
            },
          ),
          Expanded(
            child: FutureBuilder<List<Budget>>(
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
                  return Column(
                    children: [
                      _buildBudgetPieChart(budgets),
                      Expanded(child: _buildBudgetList(budgets)),
                    ],
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetPieChart(List<Budget> budgets) {
    final Map<String, double> categoryAmounts = {};

    for (final budget in budgets) {
      final category = budget.category.name;
      if (!categoryAmounts.containsKey(category)) {
        categoryAmounts[category] = 0.0;
      }
      categoryAmounts[category] = categoryAmounts[category]! + budget.amount;
    }

    final pieChartData = categoryAmounts.entries.map((entry) {
      return PieChartSectionData(
        color: _getCategoryColor(entry.key),
        value: entry.value,
        title: '${entry.value.toStringAsFixed(0)}',
        radius: 60,
        titleStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
      );
    }).toList();

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: SizedBox(
        height: 220,
        child: PieChart(
          PieChartData(
            sections: pieChartData,
            borderData: FlBorderData(show: false),
            centerSpaceRadius: 40,
          ),
        ),
      ),
    );
  }

  Widget _buildBudgetList(List<Budget> budgets) {
    final Map<String, List<Budget>> categorizedBudgets = {};

    for (final budget in budgets) {
      final name = budget.name;

      if (!categorizedBudgets.containsKey(name)) {
        categorizedBudgets[name] = [];
      }

      categorizedBudgets[name]!.add(budget);
    }

    return ListView(
      children: categorizedBudgets.entries.map((entry) {
        final category = entry.key;
        final budgets = entry.value;

        return Padding(
          padding: const EdgeInsets.all(8.0),
          child: Card(
            elevation: 4.0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12.0), // Bo góc cho Card
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  title: Text(
                    category,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                      color: Colors.deepPurpleAccent,
                    ),
                  ),
                  subtitle: Text('Total: ${_calculateTotalAmount(budgets)}', style: TextStyle(color: Colors.deepPurpleAccent)),
                ),
                Divider(),
                ...budgets.map((budget) => ListTile(
                  leading: CircleAvatar(
                    backgroundImage: NetworkImage(budget.category.categoryIcon as String),
                    backgroundColor: Colors.teal, // Màu nền của CircleAvatar
                  ),
                  title: Text(budget.name),
                  subtitle: Text(
                    'Amount: ${budget.amount}\n'
                        'Period: ${budget.periodStart.toLocal().toShortDateString()} - ${budget.periodEnd.toLocal().toShortDateString()}',
                  ),
                )),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  double _calculateTotalAmount(List<Budget> budgets) {
    return budgets.fold(0.0, (sum, budget) => sum + budget.amount);
  }

  Color _getCategoryColor(String category) {
    return Colors.primaries[category.hashCode % Colors.primaries.length];
  }
}

extension DateTimeFormatting on DateTime {
  String toShortDateString() {
    return '${this.day}/${this.month}/${this.year}';
  }
}
