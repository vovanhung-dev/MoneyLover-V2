import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Import package intl
import '../../model/Bill.dart';
import '../../data/BillAPI.dart';
import '../../data/api.dart';

class CreateOrUpdateBillDialog extends StatefulWidget {
  final BillAPI billAPI;
  final Bill? bill;

  CreateOrUpdateBillDialog({required this.billAPI, this.bill});

  @override
  _CreateOrUpdateBillDialogState createState() => _CreateOrUpdateBillDialogState();
}

class _CreateOrUpdateBillDialogState extends State<CreateOrUpdateBillDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _amountController;
  late TextEditingController _notesController;
  late TextEditingController _categoryController;
  bool _isUpdate = false;

  @override
  void initState() {
    super.initState();
    _isUpdate = widget.bill != null;
    _amountController = TextEditingController(text: widget.bill?.amount.toString() ?? '');
    _notesController = TextEditingController(text: widget.bill?.notes ?? '');
    _categoryController = TextEditingController(text: widget.bill?.category ?? '');
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    _categoryController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState?.validate() ?? false) {
      final newBill = Bill(
        id: _isUpdate ? widget.bill!.id : 'new', // Use a placeholder string for new bills
        amount: double.tryParse(_amountController.text) ?? 0.0,
        notes: _notesController.text,
        category: _categoryController.text,
        date: DateTime.now(), // Change value if needed
        fromDate: DateTime.now(), // Change value if needed
        frequency: 'monthly', // Change value if needed
        every: 1, // Change value if needed
        dueDate: DateTime.now(), // Change value if needed
        paid: false, // Change value if needed
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
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an amount';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _notesController,
              decoration: InputDecoration(labelText: "Notes"),
            ),
            TextFormField(
              controller: _categoryController,
              decoration: InputDecoration(labelText: "Category"),
            ),
            // Add other fields if needed
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
