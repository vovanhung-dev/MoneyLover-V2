import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Import package intl
import '../../model/Bill.dart';
import '../../model/BillCreate.dart';
import '../../data/BillAPI.dart';
import '../../data/WalletAPI.dart';
import '../../data/CategoryAPI.dart';
import '../../model/Wallet.dart';
import '../../model/Category.dart';

class CreateOrUpdateBillDialog extends StatefulWidget {
  final BillAPI billAPI;
  final WalletAPI walletAPI;
  final CategoryAPI categoryAPI;
  final BillCreate? bill;

  CreateOrUpdateBillDialog({
    required this.billAPI,
    required this.walletAPI,
    required this.categoryAPI,
    this.bill,
  });

  @override
  _CreateOrUpdateBillDialogState createState() => _CreateOrUpdateBillDialogState();
}

class _CreateOrUpdateBillDialogState extends State<CreateOrUpdateBillDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _amountController;
  late TextEditingController _notesController;
  String? _selectedCategoryId;
  String _selectedCategoryType = 'Expense'; // Default category type
  String? _selectedWalletId;
  bool _forever = false; // Default value
  bool _isUpdate = false;
  final DateFormat _dateFormatter = DateFormat('yyyy-MM-dd');
  List<Wallet> _wallets = [];
  List<Category> _categories = [];

  @override
  void initState() {
    super.initState();
    _isUpdate = widget.bill != null;
    _amountController = TextEditingController(
      text: widget.bill != null
          ? (widget.bill!.amount / 100).toStringAsFixed(2) // Convert amount to display value
          : '',
    );
    _notesController = TextEditingController(text: widget.bill?.notes ?? '');
    if (widget.bill != null) {
      // Set the category id, type, wallet id, and forever based on the existing bill
      _selectedCategoryId = widget.bill?.category;
      _selectedCategoryType = widget.bill?.type ?? 'Expense';
      _selectedWalletId = widget.bill?.wallet ?? '';
      _forever = widget.bill?.forever ?? false;
    }

    _loadWalletsAndCategories();
  }

  Future<void> _loadWalletsAndCategories() async {
    try {
      final wallets = await widget.walletAPI.getWallets(1); // Assume pageNumber = 1
      final categories = await widget.categoryAPI.fetchCategories();

      setState(() {
        _wallets = wallets.data.content;
        _categories = categories;
      });
    } catch (e) {
      print('Error loading wallets or categories: $e');
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState?.validate() ?? false) {
      final newBill = BillCreate(
        id: _isUpdate ? widget.bill!.id : 'new', // Use a placeholder string for new bills
        amount: (double.tryParse(_amountController.text) ?? 0.0) * 100, // Convert display amount to integer
        amountDisplay: _amountController.text, // Use the display amount directly
        notes: _notesController.text,
        category: _selectedCategoryId ?? '',
        wallet: _selectedWalletId ?? '', // Use selected wallet ID
        type: _selectedCategoryType, // Set type based on selected category
        date: DateTime.now(), // Set the current date
        fromDate: DateTime.now(), // Set the current date
        frequency: 'monthly', // Default frequency
        every: 1, // Default value
        forever: _forever, // Set forever flag
        paid: false, // Default value
      );

      final result = _isUpdate
          ? await widget.billAPI.updateBill(newBill)
          : await widget.billAPI.addBill(newBill);

      Navigator.of(context).pop(result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(_isUpdate ? "Update Bill" : "Add Bill"),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _amountController,
              decoration: InputDecoration(labelText: "Amount"),
              keyboardType: TextInputType.numberWithOptions(decimal: true),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an amount';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid number';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _notesController,
              decoration: InputDecoration(labelText: "Notes"),
            ),
            DropdownButtonFormField<String>(
              value: _selectedCategoryId,
              decoration: InputDecoration(labelText: "Category"),
              items: _categories.map((category) {
                return DropdownMenuItem(
                  value: category.id,
                  child: Text(category.name),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedCategoryId = value;
                  _selectedCategoryType = _categories
                      .firstWhere((category) => category.id == value)
                      .categoryType as String;
                });
              },
              validator: (value) => value == null ? 'Please select a category' : null,
            ),
            DropdownButtonFormField<String>(
              value: _selectedWalletId,
              decoration: InputDecoration(labelText: "Wallet"),
              items: _wallets.map((wallet) {
                return DropdownMenuItem(
                  value: wallet.id,
                  child: Text(wallet.name),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedWalletId = value;
                });
              },
              validator: (value) => value == null ? 'Please select a wallet' : null,
            ),
            CheckboxListTile(
              title: Text("Forever"),
              value: _forever,
              onChanged: (value) {
                setState(() {
                  _forever = value ?? false;
                });
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text("Cancel"),
        ),
        TextButton(
          onPressed: _submit,
          child: Text(_isUpdate ? "Update" : "Add"),
        ),
      ],
    );
  }
}
