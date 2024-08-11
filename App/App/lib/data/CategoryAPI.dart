import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shoehubapp/model/CategoryCreate.dart';
import '../model/Category.dart';
import 'api.dart';

class CategoryAPI {
  final API api;
  String? _token; // Variable to store the token

  // Constructor with API instance
  CategoryAPI(this.api);

  // Method to retrieve and set the token
  Future<void> setToken() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('token'); // Get token from SharedPreferences
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  // Fetch categories by type
  Future<List<Category>> fetchCategories() async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.get(
        'categories',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      print('API Response: ${res.data}'); // Debug print

      if (res.statusCode == 200) {
        return (res.data['data'] as List)
            .map((e) => Category.fromJson(e))
            .toList();
      } else {
        throw Exception('Failed to load categories');
      }
    } catch (e) {
      print('Error fetching categories: $e');
      throw e;
    }
  }

  // Fetch all categories
  Future<List<Category>> fetchAllCategories() async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.get(
        'categories/all',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      print('API Response: ${res.data}'); // Debug print

      if (res.statusCode == 200) {
        return (res.data['data'] as List)
            .map((e) => Category.fromJson(e))
            .toList();
      } else {
        throw Exception('Failed to load all categories');
      }
    } catch (e) {
      print('Error fetching all categories: $e');
      throw e;
    }
  }

  // Create a new category
  Future<String> createCategory(CategoryCreate category) async {
    await setToken(); // Ensure token is set
    try {
      final body = category.toJson();
      final Response res = await api.sendRequest.post(
        'category/add',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Add token to the header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Category added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add category";
      }
    } catch (e) {
      print('Error adding category: $e');
      return "Failed to add category";
    }
  }

  // Delete a category
  Future<String> deleteCategory(String categoryId) async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.delete(
        'category/delete/$categoryId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Add token to the header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Category deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid category ID";
      } else {
        return "Failed to delete category";
      }
    } catch (e) {
      print('Error deleting category: $e');
      return "Failed to delete category";
    }
  }

  // Fetch icons
  Future<List<Map<String, dynamic>>> fetchIcons() async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.get(
        'icons',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        final data = res.data as Map<String, dynamic>;
        final icons = data['data'] as List<dynamic>;
        return icons.map((e) => e as Map<String, dynamic>).toList();
      } else {
        throw Exception('Failed to load icons');
      }
    } catch (e) {
      print('Error fetching icons: $e');
      throw e;
    }
  }
}
