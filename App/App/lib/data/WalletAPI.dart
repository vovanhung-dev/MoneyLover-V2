import 'package:dio/dio.dart';
import 'package:shoehubapp/data/sharepre.dart';
import '../model/Wallet.dart';
import '../response/WalletResponse.dart';
import 'api.dart';

class WalletAPI {
  final API api;
  String? _token;

  WalletAPI(this.api);

  Future<void> setToken() async {
    try {
      _token = await getToken();
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  Future<WalletResponse> getWallets(int pageNumber) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.get(
        'wallets',
        queryParameters: {'page': pageNumber},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return WalletResponse.fromJson(res.data);
      } else {
        throw Exception('Failed to load wallets');
      }
    } catch (e) {
      print('Error fetching wallets: $e');
      throw e;
    }
  }

  Future<String> addWallet(Wallet wallet) async {
    await setToken();
    try {
      final body = wallet.toJson();
      final Response res = await api.sendRequest.post(
        'addWallet',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token'
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add wallet";
      }
    } catch (e) {
      print('Error adding wallet: $e');
      return "Failed to add wallet";
    }
  }

  Future<String> updateWallet(Wallet wallet) async {
    await setToken();
    try {
      final body = wallet.toJson();
      final Response res = await api.sendRequest.put(
        'updateWallet/${wallet.id}',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token'
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet updated successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to update wallet";
      }
    } catch (e) {
      print('Error updating wallet: $e');
      return "Failed to update wallet";
    }
  }

  Future<String> deleteWallet(String walletId) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.delete(
        'wallet/delete/$walletId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token'
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid wallet ID";
      } else {
        return "Failed to delete wallet";
      }
    } catch (e) {
      print('Error deleting wallet: $e');
      return "Failed to delete wallet";
    }
  }

  Future<String> setPrimaryWallet(String walletId) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.post(
        'wallet/changeMain/$walletId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Primary wallet set successfully";
      } else if (res.statusCode == 400) {
        return "Invalid wallet ID or request";
      } else {
        return "Failed to set primary wallet";
      }
    } catch (e) {
      print('Error setting primary wallet: $e');
      return "Failed to set primary wallet";
    }
  }

  // Xóa thành viên khỏi ví
  Future<String> removeMemberFromWallet(String walletId, String userId) async {
    await setToken();
    try {
      final body = {
        "walletId": walletId,
        "userId": userId,
      };

      print(body);
      final Response res = await api.sendRequest.post(
        'manager/delete',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Member removed successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to remove member";
      }
    } catch (e) {
      print('Error removing member: $e');
      return "Failed to remove member";
    }
  }

  // Thêm thành viên vào ví
  Future<String> addMemberToWallet(String walletId, String userId) async {
    await setToken();
    try {
      final body = {
        "walletId": walletId,
        "userId": userId,
      };
      print("addMemberToWallet");
      print(body);
      final Response res = await api.sendRequest.post(
        'manager/add',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Member added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add member";
      }
    } catch (e) {
      print('Error adding member: $e');
      return "Failed to add member";
    }
  }

  // Thay đổi quyền của thành viên trong ví
  Future<String> changeMemberPermission(String walletId, String userId, String permission) async {
    await setToken();
    try {
      final body = {
        "walletId": walletId,
        "userId": userId,
        "permission": permission,
      };
      final Response res = await api.sendRequest.post(
        'manager/permission/change',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Permission changed successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to change permission";
      }
    } catch (e) {
      print('Error changing member permission: $e');
      return "Failed to change permission";
    }
  }

  // Get user details by ID or email
  Future<Map<String, dynamic>> getUserDetails(String idOrEmail) async {
    await setToken();
    try {
      final Response res = await api.sendRequest.post(
        'user/' + idOrEmail,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return res.data['data']; // Correctly returning the user data
      } else {
        throw Exception('Failed to fetch user details');
      }
    } catch (e) {
      print('Error fetching user details: $e');
      throw e;
    }
  }

}
