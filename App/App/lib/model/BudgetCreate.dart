class BudgetCreate {
  final double amount;
  final String category;
  final bool repeat;
  final String name;
  final bool isReplace;
  final bool overWrite;

  BudgetCreate({
    required this.amount,
    required this.category,
    required this.repeat,
    required this.name,
    required this.isReplace,
    required this.overWrite,
  });

  // Factory constructor to create a BudgetCreate object from JSON
  factory BudgetCreate.fromJson(Map<String, dynamic> json) {
    return BudgetCreate(
      amount: (json['amount'] as num).toDouble(),
      category: json['category'] as String,
      repeat: json['repeat'] as bool,
      name: json['name'] as String,
      isReplace: json['isReplace'] as bool,
      overWrite: json['overWrite'] as bool,
    );
  }

  // Method to convert a BudgetCreate object to JSON
  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'category': category,
      'repeat': repeat,
      'name': name,
      'isReplace': isReplace,
      'overWrite': overWrite,
    };
  }
}
