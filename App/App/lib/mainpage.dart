import 'dart:convert';
import 'package:shoehubapp/page/Bill/GroupChatScreen.dart';
import 'package:shoehubapp/page/Budget/BudgetScreen.dart';
import 'package:shoehubapp/page/Category/CategoryScreen.dart';
import 'package:shoehubapp/page/Transaction/TransactionScreen.dart';
import 'package:shoehubapp/page/Wallet/WalletScreen.dart';
import 'package:shoehubapp/page/StatisticsScreen.dart';
import 'package:shoehubapp/page/Chatbox/chat_screen.dart';

import './page/home.dart';
import 'package:provider/provider.dart';

import '/model/user.dart';
import 'page/Profile/detail.dart';
import '/route/page3.dart';
import 'package:flutter/material.dart';
import '/page/defaultwidget.dart';
import '/data/sharepre.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Mainpage extends StatefulWidget {
  final bool isFilter;
  final int? cateID;
  const Mainpage({super.key, this.isFilter = false, this.cateID});

  @override
  State<Mainpage> createState() => _MainpageState();
}

class _MainpageState extends State<Mainpage> {
  User user = User.userEmpty();
  int _selectedIndex = 0;

  getDataUser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    String strUser = pref.getString('user')!;

    user = User.fromJson(jsonDecode(strUser));
    setState(() {});
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getDataUser();
    print(user.username);
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  _loadWidget(int index, bool isfilter, int cateId) {
    var nameWidgets = "Trang chủ";
    Widget widget =  StatisticsScreen();
    switch (index) {
      case 0:
        nameWidgets = "Trang chủ";
        widget =  StatisticsScreen();
        break;
      case 1:
        nameWidgets = "Wallet";
        widget =  WalletScreen();
        break;
      case 2:
        nameWidgets = "Budget";
        widget = BudgetScreen();
        break;
      case 3:
        nameWidgets = "Chatbot";
        widget = const ChatScreen();
        break;
      case 4:
        nameWidgets = "Chat";
        widget = GroupChatScreen();
        break;
      case 5:

        nameWidgets = "Transactions";
        widget =  TransactionScreen();
        break;
      case 6:
        nameWidgets = "Profile";
        widget = const Detail();
        break;
      default:
        nameWidgets = "None";
        widget = const FolderManagement();
        break;
    }
    return DefaultWidget(
      title: nameWidgets,
      widget: widget,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("MoneyLover"),
        actions: [
          InkWell(
            onTap: () {
              _onItemTapped(2);
            },
            child: Padding(
              padding: const EdgeInsets.only(left: 0, right: 15, top: 8, bottom: 8),
              child: Stack(
                children: [
                ],
              ),
            ),
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          // Important: Remove any padding from the ListView.
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 243, 152, 33),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  user.username!.length < 5
                      ? const SizedBox()
                      : CircleAvatar(
                          radius: 40,
                          backgroundImage: NetworkImage(
                            user.username!,
                          )),
                  const SizedBox(
                    height: 8,
                  ),
                  Text(user.username!),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Home'),
              onTap: () {
                Navigator.pop(context);
                _selectedIndex = 0;
                setState(() {});
              },
            ),
            const Divider(
              color: Colors.black,
            ),
            user.username == ''
                ? const SizedBox()
                : ListTile(
                    leading: const Icon(Icons.exit_to_app),
                    title: const Text('Logout'),
                    onTap: () {
                      logOut(context);
                    },
                  ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          const BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet_rounded),
            label: 'Wallet',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.account_balance),
            label: 'Budget',
          ),
          BottomNavigationBarItem(
              icon: Stack(
                children: [
                  const Icon(Icons.adb_outlined),
                ],
              ),
              label: "Chatbot"),
          const BottomNavigationBarItem(
            icon: Icon(Icons.ad_units_rounded),
            label: 'Chat',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.ac_unit_sharp ),
            label: 'Transaction',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
      body: _loadWidget(_selectedIndex, widget.isFilter, widget.cateID ?? 0),
    );
  }
}