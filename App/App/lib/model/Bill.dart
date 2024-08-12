class Bill {
  final String id;
  final double amount;
  final String notes;
  final String category;
  final DateTime date;
  final DateTime fromDate;
  final String frequency;
  final int every;
  final DateTime dueDate;
  final bool paid;

  Bill({
    required this.id,
    required this.amount,
    required this.notes,
    required this.category,
    required this.date,
    required this.fromDate,
    required this.frequency,
    required this.every,
    required this.dueDate,
    required this.paid,
  });

  factory Bill.fromJson(Map<String, dynamic> json) {
    final categoryData = json['category'] as Map<String, dynamic>?;

    return Bill(
      id: json['id'] as String? ?? '', // Cung cấp giá trị mặc định nếu null
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'] as String? ?? '',
      category: categoryData?['name'] as String? ?? '', // Cung cấp giá trị mặc định nếu null
      date: DateTime.tryParse(json['date'] as String? ?? '') ?? DateTime.now(),
      fromDate: DateTime.tryParse(json['from_date'] as String? ?? '') ?? DateTime.now(),
      frequency: json['frequency'] as String? ?? '',
      every: json['every'] as int? ?? 0,
      dueDate: DateTime.tryParse(json['due_date'] as String? ?? '') ?? DateTime.now(),
      paid: json['paid'] as bool? ?? false,
    );
  }


  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'notes': notes,
      'category': category,
      'date': date.toIso8601String(),
      'from_date': fromDate.toIso8601String(),
      'frequency': frequency,
      'every': every,
      'due_date': dueDate.toIso8601String(),
      'paid': paid,
    };
  }
}
