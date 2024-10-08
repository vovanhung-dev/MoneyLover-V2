import 'package:dio/dio.dart';
import 'package:shoehubapp/data/sharepre.dart';
import 'package:shoehubapp/model/TransactionCreate.dart';
import '../model/Transaction.dart';
import '../response/TransactionResponse.dart';
import 'api.dart';

class TransactionAPI {
  final API api;
  String? _token;

  TransactionAPI(this.api);

  Future<void> setToken() async {
    try {
      _token = await getToken();
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  Future<dynamic> getTransactions({
    required String wallet,
    required String start,
    required String end,
  }) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.get(
        'transactions',
        queryParameters: {
          'wallet': wallet,
        },
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );


      if (res.statusCode == 200) {
        return res.data; // Trả về dữ liệu động
      } else {
        throw Exception('Failed to load transactions');
      }
    } catch (e) {
      print('Error fetching transactions: $e');
      throw e;
    }
  }


  // Create a new transaction
  Future<String> createTransaction(TransactionCreate transaction) async {
    await setToken();
    try {
      final body = transaction.toJson();
      print("body");
      print(body);

      print(_token);
      final Response res = await api.sendRequest.post(
        'transaction/add',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      print("res");
      print(res);

      if (res.statusCode == 200) {
        return "Transaction created successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to create transaction";
      }
    } catch (e) {
      print('Error creating transaction: $e');
      return "Failed to create transaction";
    }
  }

  // Get balance in a given month
  Future<double> getMonthlyBalance({
    required String start,
    required String end,
    required String wallet,
  }) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.get(
        'transaction/balance',
        queryParameters: {
          'start': start,
          'end': end,
          'wallet': wallet,
        },
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return res.data['balance']; // Ensure the API returns balance in this key
      } else {
        throw Exception('Failed to get balance');
      }
    } catch (e) {
      print('Error fetching balance: $e');
      throw e;
    }
  }

  // Delete a transaction by ID
  Future<String> deleteTransaction(String transactionId) async {
    await setToken();
    try {
      print(transactionId);
      print(_token);


      final Response res = await api.sendRequest.delete(
        'transaction/delete/' + transactionId,
        data: transactionId, // Include the payload in the request
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Transaction deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid transaction ID";
      } else {
        return "Failed to delete transaction";
      }
    } catch (e) {
      print('Error deleting transaction: $e');
      return "Failed to delete transaction";
    }
  }

}
