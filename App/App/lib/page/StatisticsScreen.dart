import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Thư viện để định dạng ngày tháng
import '../data/api.dart'; // Đường dẫn đến APIRepository

class StatisticsScreen extends StatefulWidget {
  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  final APIRepository _apiRepository = APIRepository();
  Map<String, dynamic> _statistics = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStatistics();
  }

  Future<void> _fetchStatistics() async {
    setState(() {
      _isLoading = true;
    });

    try {
      var response = await _apiRepository.getStatistics();
      setState(() {
        _statistics = response.data;
        _isLoading = false;
      });
    } catch (e) {
      print("Failed to fetch statistics: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView(
        padding: EdgeInsets.all(16),
        children: [
          _buildStatisticItem(
              'Tổng số thành viên học tập', _statistics['totalMembers'], Colors.green, Icons.people),
          _buildStatisticItem(
              'Tổng số chủ đề', _statistics['totalTopics'], Colors.purple, Icons.topic),
          _buildStatisticItem('Tổng số từ vựng', _statistics['totalVocabularies'], Colors.red,
              Icons.library_books),
        ],
      ),
    );
  }

  Widget _buildStatisticItem(String title, dynamic value, Color color, IconData icon) {
    return Card(
      elevation: 4,
      margin: EdgeInsets.symmetric(vertical: 8),
      color: Colors.white, // Màu nền của card
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10), // Bo góc của card
        side: BorderSide(color: color, width: 2), // Viền màu sắc
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 36,
              color: color,
            ),
            SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: color, // Màu của tiêu đề
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  value.toString(),
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
