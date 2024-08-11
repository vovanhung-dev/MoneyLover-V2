// model/WalletScreen.dart
class Wallet {
  final String id;
  final String name;
  final double balance;
  final String amountDisplay;
  final String currency;
  final String type;
  bool main;

  Wallet({
    required this.id,
    required this.name,
    required this.balance,
    required this.amountDisplay,
    required this.currency,
    required this.type,
    required this.main,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      balance: (json['balance'] ?? 0.0).toDouble(),
      amountDisplay: json['amountDisplay'] ?? '',
      currency: json['currency'] ?? 'VND',
      type: json['type'] ?? 'basic',
      main: json['main'] ?? false,
    );
  }


  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'balance': balance,
      'amountDisplay': amountDisplay,
      'currency': currency,
      'type': type,
      'main': main,
    };
  }
}
