import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shoehubapp/data/BudgetAPI.dart';
import 'package:shoehubapp/data/CategoryAPI.dart';
import 'package:shoehubapp/data/WalletAPI.dart';
import 'package:shoehubapp/model/BudgetCreate.dart';
import 'package:shoehubapp/model/Category.dart';
import 'package:shoehubapp/model/Wallet.dart';

class CreateBudgetScreen extends StatefulWidget {
  final BudgetAPI budgetAPI;
  final CategoryAPI categoryAPI;
  final WalletAPI walletAPI;

  CreateBudgetScreen({
    required this.budgetAPI,
    required this.categoryAPI,
    required this.walletAPI,
  });

  @override
  _CreateBudgetScreenState createState() => _CreateBudgetScreenState();
}

class _CreateBudgetScreenState extends State<CreateBudgetScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _amountDisplayController = TextEditingController();
  final _categoryController = TextEditingController();
  final _walletController = TextEditingController();
  final _periodStartController = TextEditingController();
  final _periodEndController = TextEditingController();

  String _selectedName = 'This Week';
  bool _repeat = false;

  List<Category> _categories = [];
  List<Wallet> _wallets = [];

  @override
  void initState() {
    super.initState();
    _fetchCategoriesAndWallets();
    _updatePeriodBasedOnName(); // Initialize the date range based on the initial selection
  }

  Future<void> _fetchCategoriesAndWallets() async {
    try {
      final categories = await widget.categoryAPI.fetchCategories();
      final wallets = await widget.walletAPI.getWallets(1);

      setState(() {
        _categories = categories;
        _wallets = wallets.data.content;
      });
    } catch (e) {
      print('Error fetching categories or wallets: $e');
    }
  }

  void _updatePeriodBasedOnName() {
    final now = DateTime.now();
    DateTime start;
    DateTime end;

    if (_selectedName == 'This Week') {
      start = now.subtract(Duration(days: now.weekday - 1));
      end = now.add(Duration(days: DateTime.daysPerWeek - now.weekday));
    } else if (_selectedName == 'This Month') {
      start = DateTime(now.year, now.month, 1);
      end = DateTime(now.year, now.month + 1, 0);
    } else {
      return; // Custom option allows manual input, so do nothing here
    }

    setState(() {
      _periodStartController.text = DateFormat('yyyy-MM-dd').format(start);
      _periodEndController.text = DateFormat('yyyy-MM-dd').format(end);
    });
  }

  Future<void> _createBudget() async {
    if (_formKey.currentState!.validate()) {
      // Get the Category ID based on the name
      final selectedCategory = _categories.firstWhere(
            (category) => category.name == _categoryController.text,
        orElse: () => throw Exception('Category not found'),
      );

      // Get the Wallet ID based on the name
      final selectedWallet = _wallets.firstWhere(
            (wallet) => wallet.name == _walletController.text,
        orElse: () => throw Exception('Wallet not found'),
      );

      final budget = BudgetCreate(
        amount: double.tryParse(_amountController.text) ?? 0,
        category: selectedCategory.id, // Use the Category ID
        repeat: _repeat,
        name: _selectedName,
        amountDisplay: _amountController.text,
        wallet: selectedWallet.id, // Use the Wallet ID
        periodStart: DateTime.parse(_periodStartController.text),
        periodEnd: DateTime.parse(_periodEndController.text),
      );

      try {
        final response = await widget.budgetAPI.addBudget(budget);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response)),
        );
        Navigator.pop(context); // Go back after successful creation
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to create budget: $e')),
        );
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Budget'),
        backgroundColor: Colors.teal, // Color matching previous screens
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildDropdownField(
                label: 'Name',
                value: _selectedName,
                items: ['This Week', 'This Month', 'Custom'],
                onChanged: (value) {
                  setState(() {
                    _selectedName = value!;
                    _updatePeriodBasedOnName();
                  });
                },
              ),
              _buildTextField(
                controller: _amountController,
                label: 'Amount',
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  _amountDisplayController.text = value;
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an amount';
                  }
                  return null;
                },
              ),
              _buildDropdownField(
                label: 'Category',
                value: _categoryController.text,
                items: _categories.map((category) => category.name).toList(),
                onChanged: (value) {
                  _categoryController.text = value!;
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a category';
                  }
                  return null;
                },
              ),
              _buildDropdownField(
                label: 'Wallet',
                value: _walletController.text,
                items: _wallets.map((wallet) => wallet.name).toList(),
                onChanged: (value) {
                  _walletController.text = value!;
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a wallet';
                  }
                  return null;
                },
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Repeat', style: TextStyle(fontSize: 16)),
                  Switch(
                    value: _repeat,
                    onChanged: (value) {
                      setState(() {
                        _repeat = value;
                      });
                    },
                  ),
                ],
              ),
              if (_selectedName == 'Custom') ...[
                _buildTextField(
                  controller: _periodStartController,
                  label: 'Period Start (yyyy-MM-dd)',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the period start date';
                    }
                    try {
                      DateTime.parse(value);
                    } catch (e) {
                      return 'Invalid date format';
                    }
                    return null;
                  },
                ),
                _buildTextField(
                  controller: _periodEndController,
                  label: 'Period End (yyyy-MM-dd)',
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the period end date';
                    }
                    try {
                      DateTime.parse(value);
                    } catch (e) {
                      return 'Invalid date format';
                    }
                    return null;
                  },
                ),
              ],
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _createBudget,
                child: const Text('Create Budget'),
                style: ElevatedButton.styleFrom(
                  primary: Colors.teal,
                  padding: EdgeInsets.symmetric(vertical: 16),
                  textStyle: TextStyle(fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
    FormFieldValidator<String>? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: DropdownButtonFormField<String>(
        value: value.isEmpty ? null : value,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        ),
        items: items.map((item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(item),
          );
        }).toList(),
        onChanged: onChanged,
        validator: validator,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    TextInputType? keyboardType,
    ValueChanged<String>? onChanged,
    FormFieldValidator<String>? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        ),
        keyboardType: keyboardType,
        onChanged: onChanged,
        validator: validator,
      ),
    );
  }
}
