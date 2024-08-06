// ignore_for_file: use_build_context_synchronously

import 'dart:convert';
import '/page/auth/login.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../model/user.dart';

Future<bool> saveUser(User objUser) async {
  try {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String strUser = jsonEncode(objUser);
    prefs.setString('user', strUser);
    print("Luu thanh cong: $strUser");
    return true;
  } catch (e) {
    print(e);
    return false;
  }
}

Future<bool> saveToken(String token) async {
  try {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('token', token);
    print("Luu thanh cong: $token");
    return true;
  } catch (ex) {
    print(ex);
    return false;
  }
}

Future<bool> saveID(String accountID) async {
  try {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('accountID', accountID);
    print("Luu thanh cong: $accountID");
    return true;
  } catch (ex) {
    print(ex);
    return false;
  }
}

Future<bool> logOut(BuildContext context) async {
  try {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('user', '');
    print("Logout thành công");
    Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false);
    return true;
  } catch (e) {
    print(e);
    return false;
  }
}

//
Future<User> getUser() async {
  SharedPreferences pref = await SharedPreferences.getInstance();
  String strUser = pref.getString('user')!;
  return User.fromJson(jsonDecode(strUser));
}

Future<String> getToken() async {
  SharedPreferences pref = await SharedPreferences.getInstance();
  String token = pref.getString('token')!;
  return token;
}

Future<String> getaccountID() async {
  SharedPreferences pref = await SharedPreferences.getInstance();
  String token = pref.getString('accountID')!;
  return token;
}
