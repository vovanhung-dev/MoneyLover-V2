import 'package:flutter/material.dart';
import '../data/WalletAPI.dart';
import '../model/Wallet.dart';
import '../data/api.dart';

class StatisticsScreen extends StatefulWidget {
  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  final WalletAPI _walletAPI = WalletAPI(API());
  List<Wallet> _wallets = [];
  double _totalBalance = 0.0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchWallets();
  }

  Future<void> _fetchWallets() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final walletResponse = await _walletAPI.getWallets(0); // Fetch page 0
      if (walletResponse.data?.content != null) {
        setState(() {
          _wallets = walletResponse.data.content;
          _totalBalance = _wallets.fold(0.0, (sum, wallet) => sum + wallet.balance);
          _isLoading = false;
        });
      } else {
        _totalBalance = 0.0;
        _isLoading = false;
      }
    } catch (e) {
      print("Error fetching wallets: $e");
      _totalBalance = 0.0;
      _isLoading = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Tổng Số Tiền Trong Các Ví',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.teal,
              ),
            ),
            SizedBox(height: 20),
            _buildBalanceCard(),
            SizedBox(height: 20),
            _buildStatisticsCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: Colors.teal.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              'Tổng Số Tiền:',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.teal.shade900,
              ),
            ),
            SizedBox(height: 10),
            Text(
              '${_totalBalance.toStringAsFixed(2)} VND',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.teal.shade800,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatisticsCard() {
    // Placeholder for additional statistics, can be extended as needed
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Thống Kê Khác:',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.teal.shade900,
              ),
            ),
            SizedBox(height: 10),
            // Example statistics. You can customize or add more.
            _buildStatisticItem("Số lượng ví:", '${_wallets.length} ví'),
            _buildStatisticItem("Số ví chính:", '${_wallets.where((w) => w.main).length} ví'),
          ],
        ),
      ),
    );
  }

  Widget _buildStatisticItem(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Colors.teal.shade700,
            ),
          ),
        ],
      ),
    );
  }
}
