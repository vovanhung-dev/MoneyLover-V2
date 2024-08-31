class Category {
  final String id;
  final String name;
  final String categoryType;
  final String categoryIcon;
  final bool defaultIncome;
  final int debtLoanType;

  Category({
    required this.id,
    required this.name,
    required this.categoryType,
    required this.categoryIcon,
    required this.defaultIncome,
    required this.debtLoanType,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      categoryType: json['categoryType'] ?? '',
      categoryIcon: json['categoryIcon'] ?? '',
      defaultIncome: json['defaultIncome'] ?? false,
      debtLoanType: json['debt_loan_type'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'categoryType': categoryType,
      'categoryIcon': categoryIcon,
      'defaultIncome': defaultIncome,
      'debt_loan_type': debtLoanType,
    };
  }
}
