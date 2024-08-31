class TransactionResponse {
  final String id;
  final double amount;
  final bool remind;
  final bool exclude;
  final String notes;
  final Category category;
  final String date;
  final User user;

  TransactionResponse({
    required this.id,
    required this.amount,
    required this.remind,
    required this.exclude,
    required this.notes,
    required this.category,
    required this.date,
    required this.user,
  });

  factory TransactionResponse.fromJson(Map<String, dynamic> json) {
    return TransactionResponse(
      id: json['id'],
      amount: json['amount'].toDouble(),
      remind: json['remind'],
      exclude: json['exclude'],
      notes: json['notes'],
      category: Category.fromJson(json['category']),
      date: json['date'],
      user: User.fromJson(json['user']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'remind': remind,
      'exclude': exclude,
      'notes': notes,
      'category': category.toJson(),
      'date': date,
      'user': user.toJson(),
    };
  }
}

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
      id: json['id'],
      name: json['name'],
      categoryType: json['categoryType'],
      categoryIcon: json['categoryIcon'],
      defaultIncome: json['defaultIncome'],
      debtLoanType: json['debt_loan_type'],
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

class User {
  final String id;
  final String username;
  final String email;
  final bool enable;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.enable,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      enable: json['_enable'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      '_enable': enable,
    };
  }
}
