import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Import package intl
import '../../data/WalletAPI.dart';
import '../../data/sharepre.dart';
import '../../firebase/group_chat_service.dart';
import '../../model/Wallet.dart';
import '../../data/api.dart';
import 'SearchResultsWidget.dart';

class WalletScreen extends StatefulWidget {
  @override
  _WalletScreenState createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final WalletAPI _walletAPI = WalletAPI(API());
  List<Wallet> _wallets = [];
  bool _isLoading = true;
  String _selectedCurrency = 'VND'; // Default currency
  String _selectedType = 'basic'; // Default type

  @override
  void initState() {
    super.initState();
    _fetchWallets();
  }

  Future<void> _fetchWallets() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final walletResponse = await _walletAPI.getWallets(0); // Fetch page 0

      if (walletResponse.data?.content != null) {
        setState(() {
          _wallets = walletResponse.data.content;
          _isLoading = false;
        });

        // Print the list of managers for each wallet
        for (var wallet in _wallets) {
          print('Wallet Name: ${wallet.name}');
          print('Managers:');
          for (var manager in wallet.managers) {
            print('Manager ID: ${manager.user.id}, Username: ${manager.user.username}, Permission: ${manager.permission}');
          }
        }
      } else {
        _showSnackBar("No wallets found");
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      _showSnackBar("Failed to load wallets");
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteWallet(String walletId, int index) async {
    if (_wallets[index].main) {
      _showSnackBar("Cannot delete the primary wallet!");
      return;
    }

    try {
      final result = await _walletAPI.deleteWallet(walletId);
      _showSnackBar(result);
      if (result.contains("deleted successfully")) {
        setState(() {
          _wallets.removeAt(index);
        });
      }
    } catch (e) {
      _showSnackBar("Failed to delete wallet");
    }
  }

  Future<void> _addOrUpdateWallet([Wallet? wallet]) async {
    final isUpdate = wallet != null;
    final _formKey = GlobalKey<FormState>();
    final _nameController = TextEditingController(text: wallet?.name);
    final _balanceController = TextEditingController(text: wallet?.balance.toString());
    final _typeController = TextEditingController(text: wallet?.type ?? _selectedType);

    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isUpdate ? "Update Wallet" : "Add Wallet"),
        content: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(labelText: "Name"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _balanceController,
                decoration: InputDecoration(labelText: "Balance"),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a balance';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                value: _selectedCurrency,
                items: ['VND', 'USD'].map((currency) {
                  return DropdownMenuItem<String>(
                    value: currency,
                    child: Text(currency),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCurrency = value ?? 'VND';
                  });
                },
                decoration: InputDecoration(labelText: "Currency"),
              ),
              DropdownButtonFormField<String>(
                value: _typeController.text,
                items: ['basic'].map((type) {
                  return DropdownMenuItem<String>(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedType = value ?? 'basic';
                  });
                },
                decoration: InputDecoration(labelText: "Type"),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text("Cancel"),
          ),
          TextButton(
            onPressed: () async {
              if (_formKey.currentState?.validate() ?? false) {
                final newWallet = Wallet(
                  id: isUpdate ? wallet!.id : '', // Use existing ID for update
                  name: _nameController.text,
                  balance: double.tryParse(_balanceController.text) ?? 0.0,
                  amountDisplay: _balanceController.text,
                  currency: _selectedCurrency,
                  type: _selectedType,
                  main: isUpdate ? wallet!.main : false, managers: []
                );
                final result = isUpdate
                    ? await _walletAPI.updateWallet(newWallet)
                    : await _walletAPI.addWallet(newWallet);
                _showSnackBar(result);
                if (result.contains(isUpdate ? "updated successfully" : "added successfully")) {
                  _fetchWallets();
                  Navigator.of(context).pop();
                }
              }
            },
            child: Text(isUpdate ? "Update" : "Add"),
          ),
        ],
      ),
    );
  }

  Future<void> _setPrimaryWallet(Wallet wallet) async {
    try {
      if (wallet.main) {
        _showSnackBar("Wallet is already the primary wallet!");
        return;
      }
      final result = await _walletAPI.setPrimaryWallet(wallet.id);
      _showSnackBar(result);
      if (result.contains("Primary wallet set successfully")) {
        await _fetchWallets();
      }
    } catch (e) {
      _showSnackBar("Failed to update wallet");
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: Duration(seconds: 2),
      ),
    );
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '');
    return formatter.format(amount);
  }

  // Remove manager from wallet
  Future<void> _removeManager(String walletId, String userId) async {
    try {
      final result = await _walletAPI.removeMemberFromWallet(walletId, userId);
      await removeMemberFromGroup(walletId, userId as String);

      _showSnackBar(result);
      if (result.contains("success")) {
        await _fetchWallets(); // Refresh wallets to reflect changes
        Navigator.of(context).pop(); // Close the modal
      }
    } catch (e) {
      _showSnackBar("Failed to remove manager");
    }
  }

// Change manager permission
  Future<void> _changeManagerPermission(String walletId, String userId, String permission) async {
    try {
      final result = await _walletAPI.changeMemberPermission(walletId, userId, permission);
      _showSnackBar(result);
      if (result.contains("success")) {
        await _fetchWallets(); // Refresh wallets to reflect changes
        Navigator.of(context).pop(); // Close the modal
      }
    } catch (e) {
      _showSnackBar("Failed to change permission");
    }
  }


  void _openManagerSettingsModal(Wallet wallet) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            final TextEditingController _searchController = TextEditingController();
            List<Map<String, dynamic>> _searchResults = [];

            Future<void> _addManager(String walletId, String codeOrEmail) async {
              try {
                // Thêm quản lý vào ví
                final result = await _walletAPI.addMemberToWallet(walletId, codeOrEmail);
                _showSnackBar(result);

                if (result.contains("success")) {
                  // Cập nhật danh sách ví để phản ánh thay đổi
                  await _fetchWallets();

                  // Lấy danh sách người dùng (quản lý) từ ví đã cập nhật
                  final wallet = _wallets.firstWhere((w) => w.id == walletId);

                  // Lấy danh sách người dùng từ quản lý
                  final managerUsers = wallet.managers.map((manager) => manager.user).toList();

                  // Lấy danh sách người dùng bổ sung từ getUser
                  final additionalUser = await getUser(); // Ensure this returns a single User object

                  // Nếu getUser() trả về một đối tượng User, biến đổi thành danh sách
                  final additionalUsers = [additionalUser];

                  // Kết hợp danh sách người dùng quản lý và người dùng bổ sung
                  final users = [...managerUsers, ...additionalUsers];

                  // Gọi hàm tạo nhóm chat với danh sách người dùng
                  await createGroupChat(walletId, "New Group Name", users);
                }
              } catch (e) {
                _showSnackBar("Failed to add manager");
              }
            }

            // Function to search users based on query
            void _searchUsers(String query) async {
              try {
                if (query.isNotEmpty) {
                  final result = await _walletAPI.getUserDetails(query);
                  print('Search result: $result'); // Debugging output
                  setState(() {
                    _searchResults = [result];
                    print('Search results updated: $_searchResults'); // Debugging output

                    if (_searchResults.isNotEmpty) {
                      // Show modal with search results
                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: Text('Search Results'),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: _searchResults.map((user) {
                                return ListTile(
                                  title: Text(user['username'] as String),
                                  subtitle: Text(user['email'] as String),
                                  trailing: TextButton(
                                    onPressed: () async {
                                      print('Adding user with ID: ${user['id']}'); // Debugging when add is pressed
                                      await _addManager(wallet.id, user['id'] as String);
                                      Navigator.of(context).pop(); // Close the search results dialog
                                      Navigator.of(context).pop(); // Close the main bottom sheet
                                    },
                                    child: Text('Add'),
                                  ),
                                );
                              }).toList(),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.of(context).pop(), // Close the dialog
                                child: Text('Close'),
                              ),
                            ],
                          );
                        },
                      );
                    } else {
                      // Show a message if no results are found
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('No results found')),
                      );
                    }
                  });
                } else {
                  setState(() {
                    _searchResults = [];
                  });
                }
              } catch (e) {
                print('Error fetching user details: $e');
                setState(() {
                  _searchResults = [];
                });
              }
            }



            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 16.0,
                right: 16.0,
                top: 16.0,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Manage Wallet',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.close),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Managers (${wallet.managers.length})',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: 10),

                  // Manager List
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: wallet.managers.length,
                    itemBuilder: (context, index) {
                      var manager = wallet.managers[index];
                      return Card(
                        margin: EdgeInsets.symmetric(vertical: 4.0),
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: ListTile(
                          contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                          title: Text(manager.user.username as String),
                          subtitle: Text('Permission: ${manager.permission}'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Edit permission button
                              IconButton(
                                icon: Icon(Icons.edit, color: Colors.blue),
                                onPressed: () {
                                  // Show permission change dialog
                                  _showPermissionChangeDialog(wallet.id, manager.user.id as String, manager.permission);
                                },
                              ),
                              // Remove manager button
                              IconButton(
                                icon: Icon(Icons.delete, color: Colors.red),
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (context) => AlertDialog(
                                      title: Text("Remove Manager"),
                                      content: Text("Are you sure you want to remove this manager?"),
                                      actions: [
                                        TextButton(
                                          onPressed: () => Navigator.of(context).pop(),
                                          child: Text("Cancel"),
                                        ),
                                        TextButton(
                                          onPressed: () {
                                            _removeManager(wallet.id, manager.user.id as String);
                                            Navigator.of(context).pop();
                                          },
                                          child: Text("Remove"),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  Divider(),

                  // Add new manager
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10.0),
                    child: TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        labelText: 'Enter code or email to search',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(Icons.search),
                          onPressed: () {
                            _searchUsers(_searchController.text);
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }




  void _showPermissionChangeDialog(String walletId, String userId, String currentPermission) {
    String _newPermission = currentPermission;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Change Permission"),
          content: DropdownButtonFormField<String>(
            value: _newPermission,
            items: ['Read', 'Write', 'Delete', 'All'].map((permission) {
              return DropdownMenuItem<String>(
                value: permission,
                child: Text(permission),
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _newPermission = value ?? currentPermission;
              });
            },
            decoration: InputDecoration(
              labelText: "Select new permission",
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () async {
                await _changeManagerPermission(walletId, userId, _newPermission);
                Navigator.of(context).pop();
              },
              child: Text("Save"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal, // Bright teal color for the AppBar
        title: Text(
          "Wallets",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.add, size: 30, color: Colors.white),
            onPressed: () => _addOrUpdateWallet(),
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: _wallets.length,
        itemBuilder: (context, index) {
          var wallet = _wallets[index];
          return Dismissible(
            key: Key(wallet.id),
            direction: wallet.main
                ? DismissDirection.none
                : DismissDirection.endToStart,
            onDismissed: (direction) {
              if (!wallet.main) {
                _deleteWallet(wallet.id, index);
              }
            },
            background: Container(
              color: Colors.redAccent, // Bright red color for delete action
              alignment: Alignment.centerRight,
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Icon(Icons.delete, color: Colors.white, size: 30),
            ),
            child: Card(
              elevation: 5, // Slightly increased elevation
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0), // Rounded corners
              ),
              color: Colors.teal[50], // Light teal color for card background
              child: ListTile(
                contentPadding: EdgeInsets.all(16.0),
                leading: Icon(Icons.account_balance_wallet,
                    size: 40, color: Colors.teal),
                title: Text(
                  wallet.name,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18.0,
                    color: Colors.teal[800],
                  ),
                ),
                subtitle: Text(
                  "Balance: ${_formatCurrency(wallet.balance)} ${wallet.currency}",
                  style: TextStyle(color: Colors.teal[600]),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: Icon(wallet.main ? Icons.star : Icons.star_border),
                      color: wallet.main ? Colors.amber : Colors.grey,
                      onPressed: () => _setPrimaryWallet(wallet),
                    ),
                    IconButton(
                      icon: Icon(Icons.settings),
                      color: Colors.teal[800],
                      onPressed: () => _openManagerSettingsModal(wallet),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
