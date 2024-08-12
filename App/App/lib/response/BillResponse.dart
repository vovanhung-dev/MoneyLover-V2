import '../model/Bill.dart';

class BillResponse {
  final List<Bill> bills;
  final double dueAmount;
  final double periodAmount;
  final double todayAmount;

  BillResponse({
    required this.bills,
    required this.dueAmount,
    required this.periodAmount,
    required this.todayAmount,
  });

  factory BillResponse.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>?;

    if (data == null) {
      throw Exception('No data found in response');
    }

    var list = data['bills'] as List<dynamic>;
    List<Bill> billsList = list.map((i) => Bill.fromJson(i as Map<String, dynamic>)).toList();

    return BillResponse(
      bills: billsList,
      dueAmount: (data['due_amount'] as num).toDouble(),
      periodAmount: (data['period_amount'] as num).toDouble(),
      todayAmount: (data['today_amount'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bills': bills.map((bill) => bill.toJson()).toList(),
      'due_amount': dueAmount,
      'period_amount': periodAmount,
      'today_amount': todayAmount,
    };
  }
}

