import 'package:flutter/material.dart';
import 'package:shoehubapp/model/Category.dart';
import 'package:shoehubapp/data/api.dart';
import 'package:shoehubapp/data/sharepre.dart';
import 'package:shoehubapp/model/Transaction.dart';
import 'package:shoehubapp/response/TransactionListResponse.dart';
import 'package:shoehubapp/response/WalletResponse.dart';
import 'package:shoehubapp/data/TransactionAPI.dart';
import 'package:shoehubapp/data/CategoryAPI.dart';
import 'package:shoehubapp/data/WalletAPI.dart';

import '../../model/Wallet.dart';

class TransactionScreen extends StatefulWidget {
  @override
  _TransactionScreenState createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  late TransactionAPI _transactionAPI;
  late CategoryAPI _categoryAPI;
  late WalletAPI _walletAPI;
  late Future<List<Category>> _categoriesFuture;
  late Future<WalletResponse> _walletsFuture;
  late Future<dynamic> _transactionsFuture;
  String? _selectedWallet;
  String? _selectedCategory;
  String _transactionType = 'Expense';
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now();
  List<Category> _categories = [];
  List<Wallet> _wallets = [];
  TextEditingController _amountController = TextEditingController();
  TextEditingController _notesController = TextEditingController();
  bool _exclude = false;

  @override
  void initState() {
    super.initState();
    _transactionAPI = TransactionAPI(API());
    _categoryAPI = CategoryAPI(API());
    _walletAPI = WalletAPI(API());
    _categoriesFuture = _categoryAPI.fetchAllCategories();
    _walletsFuture = _walletAPI.getWallets(1);

    _transactionsFuture = Future.value({'data': []});

    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    try {
      final categoriesResponse = await _categoryAPI.fetchAllCategories();
      final walletsResponse = await _walletAPI.getWallets(1);

      setState(() {
        _categories = categoriesResponse;
        _wallets = walletsResponse.data.content;
        if (_wallets.isNotEmpty) {
          _selectedWallet = _wallets.first.id;
        }
        _loadTransactions();
      });
    } catch (e) {
      print('Error loading initial data: $e');
    }
  }

  Future<void> _loadTransactions() async {
    try {
      String start = '${_startDate.day}-${_startDate.month}-${_startDate.year}';
      String end = '${_endDate.day}-${_endDate.month}-${_endDate.year}';

      final response = await _transactionAPI.getTransactions(
        wallet: _selectedWallet ?? '',
        start: start,
        end: end,
      );

      setState(() {
        _transactionsFuture = Future.value(response);
      });
    } catch (e) {
      print('Error loading transactions: $e');
    }
  }

  Future<void> _createTransaction() async {
    try {
      final transaction = {
        'wallet': _selectedWallet ?? '',
        'amount': double.tryParse(_amountController.text) ?? 0.0,
        'remind': true,
        'exclude': _exclude,
        'notes': _notesController.text,
        'date': '${_startDate.day}-${_startDate.month}-${_startDate.year}',
        'category': _selectedCategory ?? '',
        'type': _transactionType,
      };
      final result = await _transactionAPI.createTransaction(transaction as Transaction);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result)));
      _loadTransactions();
    } catch (e) {
      print('Error creating transaction: $e');
    }
  }

  Future<void> _deleteTransaction(String transactionId) async {
    try {
      final result = await _transactionAPI.deleteTransaction(transactionId);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result)));
      _loadTransactions();
    } catch (e) {
      print('Error deleting transaction: $e');
    }
  }

  void _showCreateTransactionDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Create Transaction', style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButton<String>(
                  value: _selectedWallet,
                  hint: const Text('Select Wallet'),
                  items: _wallets.map((wallet) {
                    return DropdownMenuItem(
                      value: wallet.id,
                      child: Text(wallet.name),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedWallet = value;
                    });
                  },
                ),
                const SizedBox(height: 16.0),
                DropdownButton<String>(
                  value: _selectedCategory,
                  hint: const Text('Select Category'),
                  items: _categories.map((category) {
                    return DropdownMenuItem(
                      value: category.id,
                      child: Text(category.name),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedCategory = value;
                    });
                  },
                ),
                const SizedBox(height: 16.0),
                DropdownButton<String>(
                  value: _transactionType,
                  hint: const Text('Select Transaction Type'),
                  items: ['Expense', 'Income'].map((type) {
                    return DropdownMenuItem(
                      value: type,
                      child: Text(type),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _transactionType = value!;
                    });
                  },
                ),
                const SizedBox(height: 16.0),
                TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Amount',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16.0),
                TextField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    labelText: 'Notes',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Exclude from report'),
                    Switch(
                      value: _exclude,
                      onChanged: (value) {
                        setState(() {
                          _exclude = value;
                        });
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel', style: TextStyle(color: Colors.red)),
            ),
            TextButton(
              onPressed: () {
                _createTransaction();
                Navigator.of(context).pop();
              },
              child: const Text('Create', style: TextStyle(color: Colors.teal)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text('Transaction Screen'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Select Wallet',
              style: Theme.of(context).textTheme.headline6?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8.0),
            DropdownButton<String>(
              value: _selectedWallet,
              hint: const Text('Select Wallet'),
              items: _wallets.map((wallet) {
                return DropdownMenuItem(
                  value: wallet.id,
                  child: Text(wallet.name),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedWallet = value;
                  _loadTransactions(); // Load transactions when wallet is changed
                });
              },
            ),
            const SizedBox(height: 16.0),
            Expanded(
              child: FutureBuilder<dynamic>(
                future: _transactionsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || (snapshot.data['data'] as List).isEmpty) {
                    return const Center(child: Text('No transactions available.'));
                  } else {
                    final transactionsData = snapshot.data;
                    final transactions = (transactionsData['data'] as List)
                        .map((item) => Transaction.fromJson(item))
                        .toList();

                    return ListView.builder(
                      itemCount: transactions.length,
                      itemBuilder: (context, index) {
                        final transaction = transactions[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          elevation: 6.0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16.0),
                            title: Text(
                              'Amount: ${transaction.amount.toString()}',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0),
                            ),
                            subtitle: Text(transaction.notes ?? 'No notes'),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                _deleteTransaction(transaction.id);
                              },
                            ),
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.teal,
        onPressed: _showCreateTransactionDialog,
        child: const Icon(Icons.add, size: 30.0),
      ),
    );
  }
}
