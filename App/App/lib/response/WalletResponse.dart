import '../model/Wallet.dart';

class WalletResponse {
  final bool success;
  final String message;
  final String timestamp;
  final int code;
  final WalletData data;

  WalletResponse({
    required this.success,
    required this.message,
    required this.timestamp,
    required this.code,
    required this.data,
  });

  factory WalletResponse.fromJson(Map<String, dynamic> json) {
    return WalletResponse(
      success: json['success'],
      message: json['message'],
      timestamp: json['timestamp'],
      code: json['code'],
      data: WalletData.fromJson(json['data']),
    );
  }
}

class WalletData {
  final List<Wallet> content;
  final int totalPage;
  final int documentsPerPage;
  final int pageNumber;
  final int totalDocument;
  final bool isLast;

  WalletData({
    required this.content,
    required this.totalPage,
    required this.documentsPerPage,
    required this.pageNumber,
    required this.totalDocument,
    required this.isLast,
  });

  factory WalletData.fromJson(Map<String, dynamic> json) {
    var list = json['content'] as List;
    List<Wallet> contentList = list.map((i) => Wallet.fromJson(i)).toList();

    return WalletData(
      content: contentList,
      totalPage: json['totalPage'],
      documentsPerPage: json['documentsPerPage'],
      pageNumber: json['pageNumber'],
      totalDocument: json['totalDocument'],
      isLast: json['isLast'],
    );
  }
}
