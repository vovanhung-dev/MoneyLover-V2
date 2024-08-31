import 'package:flutter/material.dart';

class TransactionScreen extends StatelessWidget {
  const TransactionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text('Transaction Screen'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'This is the Transaction Page',
          style: TextStyle(
            fontSize: 24,
            color: Colors.teal[800],
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
