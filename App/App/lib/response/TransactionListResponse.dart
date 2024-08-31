import '../model/Transaction.dart';

class TransactionListResponse {
  final List<Transaction> content;

  TransactionListResponse({
    required this.content,
  });

  factory TransactionListResponse.fromJson(Map<String, dynamic> json) {
    var list = json['data'] as List;
    List<Transaction> contentList = list.map((i) => Transaction.fromJson(i)).toList();

    return TransactionListResponse(
      content: contentList,
    );
  }
}
