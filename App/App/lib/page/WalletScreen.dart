import 'package:flutter/material.dart';
import 'package:intl/intl.dart';  // Import package intl
import '../data/WalletAPI.dart';
import '../model/Wallet.dart';
import '../data/api.dart';

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
      print("Wallet Response: ${walletResponse.data}"); // Debug print

      if (walletResponse.data?.content != null) {
        setState(() {
          _wallets = walletResponse.data.content;
          _isLoading = false;
        });
      } else {
        print("Response content is null or empty");
        _showSnackBar("No wallets found");
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching wallets: $e");
      setState(() {
        _isLoading = false;
      });
      _showSnackBar("Failed to load wallets");
    }
  }

  Future<void> _deleteWallet(String walletId, int index) async {
    // Check if the wallet to delete is the primary wallet
    if (_wallets[index].main) {
      _showSnackBar("Cannot delete the primary wallet!");
      return;
    }

    try {
      final result = await _walletAPI.deleteWallet(walletId);
      _showSnackBar(result);
      if (result.contains("deleted successfully")) {
        setState(() {
          _wallets.removeAt(index); // Remove the wallet from the list
        });
      }
    } catch (e) {
      print("Failed to delete wallet: $e");
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
                  amountDisplay: _balanceController.text, // Use balance as amountDisplay
                  currency: _selectedCurrency,
                  type: _selectedType,
                  main: isUpdate ? wallet!.main : false,
                );
                final result = isUpdate
                    ? await _walletAPI.updateWallet(newWallet)
                    : await _walletAPI.addWallet(newWallet);
                _showSnackBar(result);
                if (result.contains(isUpdate ? "updated successfully" : "added successfully")) {
                  _fetchWallets(); // Refresh wallet list
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
        await _fetchWallets(); // Fetch wallets again to get the updated primary wallet status
      }
    } catch (e) {
      print("Failed to update wallet: $e");
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Wallets"),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
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
                : DismissDirection.endToStart, // Disable swipe if primary wallet
            onDismissed: (direction) {
              if (!wallet.main) {
                _deleteWallet(wallet.id, index); // Pass index to remove directly
              }
            },
            background: Container(
              color: Colors.red,
              alignment: Alignment.centerRight,
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Icon(Icons.delete, color: Colors.white),
            ),
            child: Card(
              elevation: 4,
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListTile(
                leading: Icon(Icons.account_balance_wallet,
                    size: 40, color: Colors.blue),
                title: Text(wallet.name),
                subtitle: Text(
                    "Balance: ${_formatCurrency(wallet.balance)} ${wallet.currency}"),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: Icon(wallet.main
                          ? Icons.star
                          : Icons.star_border),
                      onPressed: () => _setPrimaryWallet(wallet),
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
