class BillCreate {
  final String id;
  final double amount;
  final String amountDisplay;
  final String notes;
  final String category;
  final String wallet;
  final String type;
  final DateTime date;
  final DateTime fromDate;
  final String frequency;
  final int every;
  final bool forever;
  final bool paid;

  BillCreate({
    required this.id,
    required this.amount,
    required this.amountDisplay,
    required this.notes,
    required this.category,
    required this.wallet,
    required this.type,
    required this.date,
    required this.fromDate,
    required this.frequency,
    required this.every,
    required this.forever,
    required this.paid,
  });

  factory BillCreate.fromJson(Map<String, dynamic> json) {
    return BillCreate(
      id: json['id'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      amountDisplay: json['amountDisplay'] as String? ?? '',
      notes: json['notes'] as String? ?? '',
      category: json['category'] as String? ?? '',
      wallet: json['wallet'] as String? ?? '',
      type: json['type'] as String? ?? '',
      date: DateTime.tryParse(json['date'] as String? ?? '') ?? DateTime.now(),
      fromDate: DateTime.tryParse(json['from_date'] as String? ?? '') ?? DateTime.now(),
      frequency: json['frequency'] as String? ?? '',
      every: int.tryParse(json['every'] as String? ?? '1') ?? 1,
      forever: json['forever'] as bool? ?? false,
      paid: json['paid'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'amountDisplay': amountDisplay,
      'notes': notes,
      'category': category,
      'wallet': wallet,
      'type': type,
      'date': date.toIso8601String(),
      'from_date': fromDate.toIso8601String(),
      'frequency': frequency,
      'every': every.toString(),
      'forever': forever,
      'paid': paid,
    };
  }
}
