import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/BillAPI.dart';
import '../../model/Bill.dart';
import '../../data/api.dart';
import 'CreateOrUpdateBillDialog.dart';

class BillScreen extends StatefulWidget {
  @override
  _BillScreenState createState() => _BillScreenState();
}

class _BillScreenState extends State<BillScreen> {
  final BillAPI _billAPI = BillAPI(API());
  List<Bill> _bills = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchBills();
  }

  Future<void> _fetchBills() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final billResponse = await _billAPI.getBills();

      setState(() {
        _bills = billResponse.bills;
        _isLoading = false;
      });
    } catch (e) {
      _showSnackBar("Failed to load bills");
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteBill(String billId, int index) async {
    try {
      final result = await _billAPI.deleteBill(billId);
      _showSnackBar(result);
      if (result.contains("deleted successfully")) {
        setState(() {
          _bills.removeAt(index);
        });
      }
    } catch (e) {
      _showSnackBar("Failed to delete bill");
    }
  }

  Future<void> _addOrUpdateBill([Bill? bill]) async {
    final result = await showDialog<String>(
      context: context,
      builder: (context) => CreateOrUpdateBillDialog(
        billAPI: _billAPI,
        bill: bill,
      ),
    );

    if (result != null && result.contains("successfully")) {
      _fetchBills();
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: Duration(seconds: 2),
      ),
    );
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '');
    return formatter.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal, // Bright teal color for the AppBar
        title: Text(
          "Bills",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.add, size: 30, color: Colors.white),
            onPressed: () => _addOrUpdateBill(),
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: _bills.length,
        itemBuilder: (context, index) {
          var bill = _bills[index];
          // Calculate next bill date and days until due
          final nextBillDate = _calculateNextBillDate(bill);
          final daysUntilDue = _calculateDaysUntilDue(bill.fromDate);

          return Dismissible(
            key: Key(bill.id.toString()),
            direction: DismissDirection.endToStart,
            onDismissed: (direction) {
              _deleteBill(bill.id.toString(), index);
            },
            background: Container(
              color: Colors.redAccent, // Bright red color for delete action
              alignment: Alignment.centerRight,
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Icon(Icons.delete, color: Colors.white, size: 30),
            ),
            child: Card(
              elevation: 5, // Slightly increased elevation
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0), // Rounded corners
              ),
              color: Colors.teal[50], // Light teal color for card background
              child: ListTile(
                contentPadding: EdgeInsets.all(16.0),
                leading: Icon(Icons.receipt, size: 40, color: Colors.teal),
                title: Text(
                  bill.notes,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18.0,
                    color: Colors.teal[800],
                  ),
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Amount: ${_formatCurrency(bill.amount)}",
                      style: TextStyle(color: Colors.teal[600]),
                    ),
                    Text(
                      "Category: ${bill.category}",
                      style: TextStyle(color: Colors.teal[600]),
                    ),
                    Text(
                      "Next Bill: ${DateFormat.yMMMd().format(nextBillDate)}",
                      style: TextStyle(color: Colors.teal[600]),
                    ),
                    Text(
                      "Due in: $daysUntilDue days",
                      style: TextStyle(color: Colors.teal[600]),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  DateTime _calculateNextBillDate(Bill bill) {
    return bill.fromDate.add(Duration(days: 1));
  }

  int _calculateDaysUntilDue(DateTime fromDate) {
    // Lấy ngày hiện tại ở múi giờ địa phương và đặt giờ, phút, giây về 0
    final now = DateTime.now().toLocal().subtract(Duration(
      hours: DateTime.now().hour,
      minutes: DateTime.now().minute,
      seconds: DateTime.now().second,
      milliseconds: DateTime.now().millisecond,
    ));

    // Lấy ngày từ `fromDate` và đặt giờ, phút, giây về 0
    final fromDateStart = DateTime(fromDate.year, fromDate.month, fromDate.day);

    // Tính toán số ngày giữa hai ngày
    final difference = now.difference(fromDateStart).inDays + 1;

    print('Now: $now');
    print('From Date: $fromDateStart');
    print('Difference: $difference');

    return difference;
  }
}
