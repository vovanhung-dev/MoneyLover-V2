import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

import '../../data/api.dart';
import '../../data/sharepre.dart';
import '../../model/Transaction.dart';
import '../../model/Wallet.dart';
import '../../response/TransactionListResponse.dart';
import '../../response/WalletResponse.dart';
import '../../response/TransactionResponse.dart';
import '../../data/TransactionAPI.dart';

class TransactionScreen extends StatefulWidget {
  const TransactionScreen({Key? key}) : super(key: key);

  @override
  _TransactionScreenState createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  late TransactionAPI _transactionAPI;
  late Future<List<Category>> _categoriesFuture;
  late Future<WalletResponse> _walletsFuture;
  late Future<TransactionListResponse> _transactionsFuture;
  String _selectedWallet = '';
  String _selectedCategory = '';
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _transactionAPI = TransactionAPI(API());
    _categoriesFuture = fetchAllCategories();
    _walletsFuture = getWallets(1); // You can change the page number as needed
  }

  Future<List<Category>> fetchAllCategories() async {
    final API api = API();
    final String? _token = await getToken();
    try {
      final Response res = await api.sendRequest.get(
        'categories?type=All',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return (res.data['data'] as List)
            .map((e) => Category.fromJson(e))
            .toList();
      } else {
        throw Exception('Failed to load all categories');
      }
    } catch (e) {
      print('Error fetching all categories: $e');
      throw e;
    }
  }

  Future<WalletResponse> getWallets(int pageNumber) async {
    final API api = API();
    final String? _token = await getToken();
    try {
      final Response res = await api.sendRequest.get(
        'wallets',
        queryParameters: {'page': pageNumber},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return WalletResponse.fromJson(res.data);
      } else {
        throw Exception('Failed to load wallets');
      }
    } catch (e) {
      print('Error fetching wallets: $e');
      throw e;
    }
  }

  Future<void> _loadTransactions() async {
    try {
      String start = '${_startDate.day}-${_startDate.month}-${_startDate.year}';
      String end = '${_endDate.day}-${_endDate.month}-${_endDate.year}';

      final response = await _transactionAPI.getTransactions(
        wallet: _selectedWallet,
        category: _selectedCategory,
        start: start,
        end: end,
      );

      setState(() {
        _transactionsFuture = Future.value(TransactionListResponse.fromJson(response as Map<String, dynamic>));
      });
    } catch (e) {
      print('Error loading transactions: $e');
    }
  }


  Future<void> _createTransaction() async {
    try {
      final transaction = Transaction(
        wallet: _selectedWallet,
        amount: 100000,
        remind: true,
        exclude: false,
        notes: '',
        date: '20-8-2024',
        category: _selectedCategory,
        type: 'Expense', id: '',
      );
      final result = await _transactionAPI.createTransaction(transaction);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result)));
      _loadTransactions(); // Refresh the list
    } catch (e) {
      print('Error creating transaction: $e');
    }
  }

  Future<void> _deleteTransaction(String transactionId) async {
    try {
      final result = await _transactionAPI.deleteTransaction(transactionId);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result)));
      _loadTransactions(); // Refresh the list
    } catch (e) {
      print('Error deleting transaction: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text('Transaction Screen'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<List<Category>>(
              future: _categoriesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No categories available.'));
                } else {
                  final categories = snapshot.data!;
                  return ListView.builder(
                    itemCount: categories.length,
                    itemBuilder: (context, index) {
                      final category = categories[index];
                      return ListTile(
                        title: Text(category.name),
                        subtitle: Text(category.categoryType),
                        leading: Image.network(category.categoryIcon),
                        onTap: () {
                          setState(() {
                            _selectedCategory = category.id;
                            _loadTransactions();
                          });
                        },
                      );
                    },
                  );
                }
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<WalletResponse>(
              future: _walletsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.data.content.isEmpty) {
                  return const Center(child: Text('No wallets available.'));
                } else {
                  final wallets = snapshot.data!.data.content;
                  return ListView.builder(
                    itemCount: wallets.length,
                    itemBuilder: (context, index) {
                      final wallet = wallets[index];
                      return ListTile(
                        title: Text(wallet.name),
                        subtitle: Text('Balance: ${wallet.balance} ${wallet.currency}'),
                        onTap: () {
                          setState(() {
                            _selectedWallet = wallet.id;
                            _loadTransactions();
                          });
                        },
                      );
                    },
                  );
                }
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<TransactionListResponse>(
              future: _transactionsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.content.isEmpty) {
                  return const Center(child: Text('No transactions available.'));
                } else {
                  final transactions = snapshot.data!.content;
                  return ListView.builder(
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      final transaction = transactions[index];
                      return ListTile(
                        title: Text(transaction.amount.toString()),
                        subtitle: Text(transaction.notes ?? 'No notes'),
                        trailing: IconButton(
                          icon: Icon(Icons.delete),
                          onPressed: () {
                            _deleteTransaction(transaction.wallet); // Use correct property
                          },
                        ),
                      );
                    },
                  );
                }
              },
            ),
          ),

          ElevatedButton(
            onPressed: _createTransaction,
            child: const Text('Create Transaction'),
          ),
        ],
      ),
    );
  }
}
