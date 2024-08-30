-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 26, 2024 at 08:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moneylove`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `id` varchar(255) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `wallet_id` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `recurring_id` varchar(255) DEFAULT NULL,
  `paid` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`id`, `amount`, `user_id`, `wallet_id`, `date`, `notes`, `category_id`, `recurring_id`, `paid`) VALUES
('404691b6-225a-4f53-8c66-6562b094ef11', 20000, 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', '2024-06-20', NULL, 'asidas-2312qw-129-wqiew', '966eb28c-9999-4d27-8787-89d26224582f', b'0'),
('465c8042-8f5d-4095-989a-9c61ea679ae2', 200000, '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', NULL, '2024-06-18', NULL, NULL, '35fcea7e-a41b-4707-ac6a-84b4daceb5e7', b'0'),
('bcf0bd2d-5e51-4ba4-aa74-6c244b594b77', 500000, '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', '2024-06-18', NULL, 'akjsnd-1o2i12-31xi2312-wq', 'ffe60187-b4bb-4f30-adf4-353c00a8cacd', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `bills_categories`
--

CREATE TABLE `bills_categories` (
  `bill_id` varchar(255) NOT NULL,
  `categories_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `budgets`
--

CREATE TABLE `budgets` (
  `id` varchar(255) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `period_end` date DEFAULT NULL,
  `period_start` date DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `wallet_id` varchar(255) DEFAULT NULL,
  `repeat_bud` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budgets`
--

INSERT INTO `budgets` (`id`, `amount`, `period_end`, `period_start`, `user_id`, `category_id`, `wallet_id`, `repeat_bud`, `name`) VALUES
('0b7499f9-c8ab-438d-90bb-54e001fd7235', 200, '2024-09-01', '2024-08-26', 'da8b575f-d195-419e-a805-74638d3bd85f', '1982u3oq-iqwueh1-eqwioe2-22', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', b'1', 'This week'),
('10f0e806-09d2-43af-9c22-ffa05c5016e6', 20000, '2024-09-01', '2024-08-26', '672a65e1-b8a4-4706-8c17-98b16e70f931', '1982u3oq-iqwueh1-eqwioe2-22', '3c0a8b43-9995-47a9-a0af-aa564c1e06fa', b'0', 'This week'),
('2d6cd875-3bde-4f75-aef5-bbd925fdfaa0', 500, '2024-08-31', '2024-08-18', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', b'0', NULL),
('300033e6-6646-4f6f-962e-8d71c4276d18', 1000000, '2024-08-31', '2024-08-01', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'asidas-31928j-129-wqiew', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This month'),
('44c91f4e-f750-4090-8aa8-760f8223db67', 5000, '2024-08-31', '2024-08-01', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', 'b8404b7b-4381-4c69-84b9-9a5771724623', b'0', 'This month'),
('58a84e5e-517a-45fc-a3e7-b9985f44debd', 50000, '2024-08-31', '2024-08-01', 'dd185a16-86f0-4577-90e4-0a65fefa1422', '4dd45b49-49df-4885-815d-0ef4f2be5a78', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This month'),
('72a31bbb-7291-4649-9ba4-722a2994b732', 100000, '2024-09-01', '2024-08-26', '672a65e1-b8a4-4706-8c17-98b16e70f931', '1982u3oq-iqwueh1-eqwioe2-22', '3c0a8b43-9995-47a9-a0af-aa564c1e06fa', b'0', 'This week'),
('8a8d5b1f-69fe-4d3f-bdab-aaed6dde36f9', 600000, '2024-08-25', '2024-08-19', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', 'b8404b7b-4381-4c69-84b9-9a5771724623', b'0', 'This week'),
('8c78e2ac-c69f-4fb4-ba65-82d66aa3728f', 30000, '2024-08-25', '2024-08-19', 'dd185a16-86f0-4577-90e4-0a65fefa1422', '1982u3oq-iqwueh1-eqwioe2-22', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This week'),
('b2bc9e74-c239-4326-a8fb-aec816306f14', 5000, '2024-08-25', '2024-08-19', 'dd185a16-86f0-4577-90e4-0a65fefa1422', '4dd45b49-49df-4885-815d-0ef4f2be5a78', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This week'),
('ba842ac0-52c8-4689-91f0-2d7ec5e1335d', 60000, '2024-08-18', '2024-08-12', 'dd185a16-86f0-4577-90e4-0a65fefa1422', '1982u3oq-iqwueh1-eqwioe2-22', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This week'),
('d975402e-f07c-448f-a4c2-55c33490905b', 500000, '2024-08-04', '2024-07-29', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'asidas-2312qw-129-wqiew', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', b'0', 'This week');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(255) NOT NULL,
  `category_icon` varchar(255) DEFAULT NULL,
  `category_type` enum('Debt_Loan','Expense','Income') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `budget_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `debt_loan_type` int(11) NOT NULL,
  `default_income` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_icon`, `category_type`, `name`, `budget_id`, `user_id`, `debt_loan_type`, `default_income`) VALUES
('0912n-12jjnd-123jd-as', 'https://img.icons8.com/?size=100&id=25259&format=png&color=000000\r\n', 'Debt_Loan', 'Loan', NULL, NULL, 2, b'0'),
('10982j39d1-12ij39-12j3hw', 'https://img.icons8.com/?size=100&id=112470&format=png&color=000000\r\n', 'Debt_Loan', 'Repayment', NULL, NULL, 2, b'0'),
('1982u3oq-iqwueh1-eqwioe2-22', 'https://img.icons8.com/?size=100&id=80857&format=png&color=000000\r\n', 'Expense', 'education', NULL, NULL, 0, b'0'),
('4dd45b49-49df-4885-815d-0ef4f2be5a78', 'https://img.icons8.com/?size=100&id=11883&format=png&color=000000', 'Expense', 'sony', NULL, 'dd185a16-86f0-4577-90e4-0a65fefa1422', 0, b'0'),
('78a2e1db-9d70-4b26-ac4d-bdaa17b74e74', 'https://img.icons8.com/?size=100&id=101487&format=png&color=000000', 'Expense', 'cafe', NULL, 'da8b575f-d195-419e-a805-74638d3bd85f', 0, b'0'),
('9f8c879e-ab56-4353-a40e-dabc1aab8f35', 'https://img.icons8.com/?size=100&id=11883&format=png&color=000000', 'Expense', 'travel', NULL, 'da8b575f-d195-419e-a805-74638d3bd85f', 0, b'0'),
('a3132ae1-c1f6-47e2-8270-dfe88a2306b7', 'https://img.icons8.com/?size=100&id=109162&format=png&color=000000', 'Expense', 'cuptea', NULL, '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 0, b'0'),
('akjsnd-1o2i12-31xi2312-wq', 'https://img.icons8.com/?size=100&id=53444&format=png&color=000000\r\n', 'Debt_Loan', 'Debt', NULL, NULL, 1, b'0'),
('asidas-2312qw-129-wqiew', 'https://img.icons8.com/?size=100&id=80857&format=png&color=000000\r\n', 'Income', 'Bills', NULL, NULL, 0, b'0'),
('asidas-31928j-129-wqiew', 'https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000', 'Expense', 'Food', NULL, NULL, 0, b'0'),
('f3d9a83b-4d61-447a-aa17-f36081101104', 'https://img.icons8.com/?size=100&id=wV09Rqzv7s8J&format=png&color=000000', 'Expense', 'girlfriend', NULL, '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 0, b'0'),
('mans-12930jd-qw-9e12e2', 'https://img.icons8.com/?size=100&id=42840&format=png&color=000000\r\n', 'Debt_Loan', 'Debt collection', NULL, NULL, 1, b'0'),
('mniwe-qwo123-cjxnkzn9as-123', 'https://img.icons8.com/?size=100&id=42840&format=png&color=000000', 'Income', 'Income transfer', NULL, NULL, 0, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `friend_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `status`, `friend_id`, `user_id`, `created_at`) VALUES
('b6747ef9-64cc-4360-8d84-068a1c7acf6b', 'accepted', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', '672a65e1-b8a4-4706-8c17-98b16e70f931', '2024-08-26 20:06:56.000000');

-- --------------------------------------------------------

--
-- Table structure for table `icon`
--

CREATE TABLE `icon` (
  `id` varchar(255) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `icon`
--

INSERT INTO `icon` (`id`, `path`, `name`) VALUES
('4a3c5f8b-fbfc-49af-9868-6c4a505295f3', 'https://img.icons8.com/?size=100&id=wV09Rqzv7s8J&format=png&color=000000', 'home'),
('66755935-2e5f-4f6f-87f6-7e8499bd6acc', 'https://img.icons8.com/?size=100&id=11883&format=png&color=000000', 'box'),
('68a7ea98-67fd-40e5-b1d2-fff76c9cf90b', 'https://img.icons8.com/?size=100&id=109162&format=png&color=000000', 'cup'),
('e100acb2-02e1-4421-b06e-46b47742b4c3', 'https://img.icons8.com/?size=100&id=101487&format=png&color=000000', 'food');

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` varchar(255) NOT NULL,
  `permission` enum('All','Delete','Read','Write') DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `wallet_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`id`, `permission`, `user_id`, `wallet_id`) VALUES
('6575b30c-9ed8-4dfe-bf01-615b456cc052', 'Read', '03b9e99c-8f5a-4d57-9f2d-946a472a4f79', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7'),
('ab2556e2-e7f6-4462-97cc-e7687a89b034', 'Read', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7'),
('f6eb4c33-7153-42e4-b1bd-94920be85d18', 'Write', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` varchar(255) NOT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `unread` bit(1) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `wallet` varchar(255) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `created_date`, `message`, `unread`, `category`, `user`, `wallet`, `type`) VALUES
('03d52c01-ec3c-444f-a394-ba3082530f91', '2024-08-26 18:28:55.000000', NULL, b'1', 'education', 'JEXjC5GUZq', 'test1', 1),
('20f93889-6570-4da9-910a-7a32a58da402', '2024-08-26 18:28:47.000000', NULL, b'1', 'education', 'JEXjC5GUZq', 'test1', 1),
('2667c74b-9e36-49d6-8a6f-24bfd43bb87c', '2024-08-24 02:34:13.000000', NULL, b'0', 'Food', 'ngoc', 'main', NULL),
('41ccda60-d505-45f7-89a5-9b961dcecf5f', '2024-08-24 02:33:51.000000', NULL, b'0', 'cuptea', 'ngoc', 'main', NULL),
('4dfc3cef-4d4e-4035-97c8-e78aba763ef8', '2024-08-26 18:28:10.000000', NULL, b'1', 'cafe', 'JEXjC5GUZq', 'test1', 1),
('67c156fd-2368-4fe8-811f-845c0b273b54', '2024-08-26 20:06:56.000000', NULL, b'1', NULL, 'troughie', NULL, 0),
('8919bb24-c103-447f-910f-07214b2e1086', '2024-08-26 20:06:22.000000', NULL, b'1', NULL, 'troughie', NULL, 0),
('9318e075-1900-43af-beda-2eaf6cef6350', '2024-08-26 18:27:45.000000', NULL, b'1', 'travel', 'JEXjC5GUZq', 'test1', 1),
('c1737a78-afdc-48b3-849c-8ea88e6459b0', '2024-08-26 18:31:01.000000', NULL, b'1', 'education', 'JEXjC5GUZq', 'test1', 1),
('fd513f97-ad66-403c-bad5-426b50fa8b15', '2024-08-26 18:35:46.000000', NULL, b'1', 'cuptea', 'ngoc', 'test1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `recurring`
--

CREATE TABLE `recurring` (
  `id` varchar(255) NOT NULL,
  `day_of_week` varchar(255) DEFAULT NULL,
  `every` int(11) NOT NULL,
  `forever` bit(1) NOT NULL,
  `frequency` varchar(255) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `bill_id` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `date_of_week` int(11) NOT NULL,
  `for_time` int(11) NOT NULL,
  `occurrence_in_month` int(11) NOT NULL,
  `done` bit(1) NOT NULL,
  `send_count` int(11) NOT NULL,
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recurring`
--

INSERT INTO `recurring` (`id`, `day_of_week`, `every`, `forever`, `frequency`, `from_date`, `to_date`, `bill_id`, `transaction_id`, `date_of_week`, `for_time`, `occurrence_in_month`, `done`, `send_count`, `due_date`) VALUES
('35fcea7e-a41b-4707-ac6a-84b4daceb5e7', NULL, 1, b'1', 'days', '2024-06-19', NULL, NULL, NULL, 0, 0, 0, b'0', 0, NULL),
('770a25e8-9b94-4684-93e4-477aae604894', NULL, 1, b'1', 'weeks', '2024-06-27', NULL, NULL, NULL, 4, 0, 0, b'0', 0, NULL),
('788a0efd-784a-4830-a99f-312e04543f00', NULL, 1, b'1', 'weeks', '2024-06-24', NULL, NULL, NULL, 1, 0, 0, b'0', 0, NULL),
('966eb28c-9999-4d27-8787-89d26224582f', NULL, 1, b'0', 'days', '2024-06-21', '2024-06-29', NULL, NULL, 3, 0, 0, b'0', 0, NULL),
('c25b2e92-697c-4147-89c6-7956c1362d82', NULL, 1, b'1', 'days', '2024-06-23', NULL, NULL, NULL, 0, 0, 0, b'0', 0, NULL),
('d62e7999-2642-4f71-9d08-8b4b44b56b49', NULL, 1, b'1', 'days', '2024-06-27', NULL, NULL, NULL, 0, 0, 0, b'0', 0, NULL),
('ffe60187-b4bb-4f30-adf4-353c00a8cacd', NULL, 1, b'1', 'days', '2024-06-19', NULL, NULL, NULL, 0, 0, 0, b'0', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transations`
--

CREATE TABLE `transations` (
  `id` varchar(255) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `exclude` bit(1) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `remind` bit(1) NOT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `wallet_id` varchar(255) DEFAULT NULL,
  `budget_id` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `recurring_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transations`
--

INSERT INTO `transations` (`id`, `amount`, `currency`, `exclude`, `notes`, `remind`, `category_id`, `user_id`, `wallet_id`, `budget_id`, `date`, `recurring_id`) VALUES
('0318d6a6-a353-4053-87f8-01a7b3c42c3e', 50000, NULL, b'0', NULL, b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-21', NULL),
('077eb770-a88e-4fc2-b4f5-5e5091b3d063', 30000, NULL, b'0', NULL, b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-25', NULL),
('0e87d886-337b-4e60-844e-ed46fe651106', 20, NULL, b'0', '', b'0', '9f8c879e-ab56-4353-a40e-dabc1aab8f35', 'da8b575f-d195-419e-a805-74638d3bd85f', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-26', NULL),
('236495c4-6f2f-456d-9c0d-9b78501e8c73', 500000, NULL, b'0', '', b'0', 'mniwe-qwo123-cjxnkzn9as-123', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-07-29', NULL),
('27c9643e-7ef2-46c5-a5f1-6950c184d9b5', 50000, NULL, b'0', NULL, b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-21', NULL),
('3bc81f0f-b6a2-4bde-81c5-87b1847c4819', 500000, NULL, b'0', 'hehehhe', b'0', 'mniwe-qwo123-cjxnkzn9as-123', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-22', NULL),
('3c5c9b15-76d4-4e92-9e1e-365f84f62c98', 100000, NULL, b'0', '', b'0', '1982u3oq-iqwueh1-eqwioe2-22', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-22', NULL),
('438fcbac-99ab-438b-a261-db10520426df', 30000, NULL, b'0', '', b'0', 'f3d9a83b-4d61-447a-aa17-f36081101104', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-07-23', NULL),
('4ab7aba9-f9fa-4277-bf90-77808e77db52', 500000, NULL, b'0', '', b'0', '1982u3oq-iqwueh1-eqwioe2-22', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-21', NULL),
('4fe01429-da76-474c-94ce-2b97c9c32c2c', 500000, NULL, b'0', '', b'0', '4dd45b49-49df-4885-815d-0ef4f2be5a78', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-12', NULL),
('508e0dc0-227f-4e5a-a6ed-d1a67f8505a1', 40, NULL, b'0', '', b'0', '1982u3oq-iqwueh1-eqwioe2-22', 'da8b575f-d195-419e-a805-74638d3bd85f', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-27', NULL),
('58429518-a676-40ef-8ebd-cab4e37b2d7e', 50000, NULL, b'0', '', b'0', 'asidas-2312qw-129-wqiew', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-08-23', NULL),
('67f96a01-5ef6-4151-ae70-ad61844f28bd', 30000, NULL, b'0', NULL, b'1', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-25', 'd62e7999-2642-4f71-9d08-8b4b44b56b49'),
('69ea9f02-35fa-4947-8a3b-195a2527197d', 500000, NULL, b'0', '', b'0', 'asidas-2312qw-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-07-31', NULL),
('6d4e90fb-8131-4ad4-909c-dcea46356211', 10, NULL, b'0', '', b'0', '1982u3oq-iqwueh1-eqwioe2-22', 'da8b575f-d195-419e-a805-74638d3bd85f', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-18', NULL),
('74d87be7-8d73-40c3-a2b1-dce57b9b1dff', 10, NULL, b'1', 'dong tien hoc', b'0', '1982u3oq-iqwueh1-eqwioe2-22', 'da8b575f-d195-419e-a805-74638d3bd85f', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-26', NULL),
('94414413-df5d-4f9e-8f29-ddf58b686966', 50000, NULL, b'0', '', b'0', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-08-23', NULL),
('995fd8fe-41d1-4cb4-890d-94d6e94a7c35', 700000, NULL, b'0', '', b'0', '4dd45b49-49df-4885-815d-0ef4f2be5a78', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-12', NULL),
('9f9a07f2-519b-4889-9d8d-0c5676bbaeb7', 500000, NULL, b'0', NULL, b'0', 'mniwe-qwo123-cjxnkzn9as-123', 'dd185a16-86f0-4577-90e4-0a65fefa1422', '7c5ac68e-8ca8-476c-9a67-be9a8537e2e2', NULL, '2024-06-20', NULL),
('a09721e1-f951-487b-8874-ddf370558c38', 50000, NULL, b'0', '', b'0', 'f3d9a83b-4d61-447a-aa17-f36081101104', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-07-31', NULL),
('a6460fbf-fb71-490f-a477-031b2ac07d25', 200000, NULL, b'0', '', b'0', 'mniwe-qwo123-cjxnkzn9as-123', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-07-31', NULL),
('ae7cfd51-a869-4a25-8bcd-e374e5fa6ea0', 200000, NULL, b'0', 'asx', b'0', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-07-23', NULL),
('b1777d92-11b7-4a36-a08c-a1f73a17effc', 50000, NULL, b'0', NULL, b'1', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-21', 'c25b2e92-697c-4147-89c6-7956c1362d82'),
('b5eac0f5-887e-484e-a7b5-8771ff33f26c', 700000, NULL, b'0', '', b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-12', NULL),
('bdb47aab-9715-4508-80ca-24a42a307765', 50000, NULL, b'0', NULL, b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-22', NULL),
('c395e08c-f58a-4a48-96e2-47183108bbd6', 800000, NULL, b'0', '', b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-08-12', NULL),
('c5b736df-5beb-4fb5-adda-adfe798a2da3', 30000, NULL, b'0', NULL, b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-06-25', NULL),
('ca47efbb-dce8-45a7-9432-12a6d2162cfb', 10, NULL, b'0', '', b'0', '78a2e1db-9d70-4b26-ac4d-bdaa17b74e74', 'da8b575f-d195-419e-a805-74638d3bd85f', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-27', NULL),
('d2d01656-9c83-4947-bd18-a5369f66ce4b', 200000, NULL, b'0', '', b'0', 'asidas-31928j-129-wqiew', 'dd185a16-86f0-4577-90e4-0a65fefa1422', 'd68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', NULL, '2024-07-30', NULL),
('e8d98f89-f007-456f-b4d3-06025c7fd6e2', 10, NULL, b'0', 'ngon', b'0', 'a3132ae1-c1f6-47e2-8270-dfe88a2306b7', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', '1f1e3884-ea41-4e59-b9f8-e35330bbedfc', NULL, '2024-08-26', NULL),
('e9c518e9-852c-4c3e-a138-dc8f568ba1b5', 50000, NULL, b'0', NULL, b'1', 'asidas-31928j-129-wqiew', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-06-24', '788a0efd-784a-4830-a99f-312e04543f00'),
('ebdd3fb1-8f9c-4f34-8854-ebf244dfb500', 200000, NULL, b'0', NULL, b'1', '1982u3oq-iqwueh1-eqwioe2-22', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'b8404b7b-4381-4c69-84b9-9a5771724623', NULL, '2024-06-27', '770a25e8-9b94-4684-93e4-477aae604894');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_enable` bit(1) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `is_enable`, `password`, `username`) VALUES
('03b9e99c-8f5a-4d57-9f2d-946a472a4f79', 'tngoc2906@gmail.com', b'0', '$2a$10$38efba/LJXZSstVw/WiW7u4WiITdSeAYbqQprXAlykrxTXYj5.Ugm', 'hello'),
('672a65e1-b8a4-4706-8c17-98b16e70f931', 'ngoc@gmail.com', b'0', '$2a$10$oPjQ96xskfLkwsEV.II2fuq38F/OG8XEJg1eTmF9Qq9JcEj61Yoy6', 'troughie'),
('97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', 'nguyentienngoc7166@gmail.com', b'1', '$2a$10$nCR6/dVN1qPJxMSaBQ6kE.qbdqThLy89TQzEYmlf/4sQrqvROWeHe', 'ngoc'),
('da8b575f-d195-419e-a805-74638d3bd85f', 'ngocnt@ebizworld.com.vn', b'0', '$2a$10$kaLIA5633Hi3qTb5q2e6YetWAmGwHCoRR6.FLE2mMjWa8zcDkh5Uy', 'JEXjC5GUZq'),
('dd185a16-86f0-4577-90e4-0a65fefa1422', 'ngocnguyen29061@gmail.com', b'0', '$2a$10$icllj8WRCNomFi2l9AM2.ev4OhpaGXwSV..4etFmYJDlpnVL9yWfa', 'tngoc');

-- --------------------------------------------------------

--
-- Table structure for table `user_notification`
--

CREATE TABLE `user_notification` (
  `notification_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_notification`
--

INSERT INTO `user_notification` (`notification_id`, `user_id`) VALUES
('41ccda60-d505-45f7-89a5-9b961dcecf5f', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c'),
('2667c74b-9e36-49d6-8a6f-24bfd43bb87c', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c'),
('fd513f97-ad66-403c-bad5-426b50fa8b15', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c'),
('8919bb24-c103-447f-910f-07214b2e1086', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c'),
('67c156fd-2368-4fe8-811f-845c0b273b54', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` varchar(255) NOT NULL,
  `balance` bigint(20) NOT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start` bigint(20) NOT NULL,
  `target` bigint(20) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `main` bit(1) NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `balance`, `currency`, `name`, `start`, `target`, `type`, `user_id`, `main`, `end_date`) VALUES
('1f1e3884-ea41-4e59-b9f8-e35330bbedfc', 2000, 'USD', 'test1', 0, 0, 'basic', 'da8b575f-d195-419e-a805-74638d3bd85f', b'1', NULL),
('231a300c-8607-43f6-8361-81f8e6608949', 1000, 'USD', 'usdCard', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('2d924fd5-5110-4ba4-91b8-98ea9c702e5e', 4780000, 'VND', 'hehe', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('2e39046f-f4ed-42b5-b806-52158dc034aa', 0, 'VND', 'saving to travel', 1000000, 0, 'goal', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('3c0a8b43-9995-47a9-a0af-aa564c1e06fa', 500000, 'VND', 'linh tinh', 0, 0, 'basic', '672a65e1-b8a4-4706-8c17-98b16e70f931', b'1', NULL),
('7910882c-170c-4a76-904c-fce190ad7ead', 1234567, 'VND', 'saving to shopping', 1234567, 2000000, 'goal', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('7c2d8c22-c854-4cdc-9e39-7097ac5229fd', 300000, 'VND', 'bills', 300000, 1000000, 'goal', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('7c5ac68e-8ca8-476c-9a67-be9a8537e2e2', 0, 'VND', 'buy a house', 500000, 10000000, 'goal', 'dd185a16-86f0-4577-90e4-0a65fefa1422', b'0', '2024-09-29'),
('b1f0506e-4883-4ca2-a5ad-e8835cdf210a', 50000, 'VND', 'hello', 0, 0, 'basic', 'dd185a16-86f0-4577-90e4-0a65fefa1422', b'0', NULL),
('b8404b7b-4381-4c69-84b9-9a5771724623', 950000, 'VND', 'Travel', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'1', NULL),
('b9a9a8ff-47c4-4059-95d7-c5b346600b45', 20000, 'VND', 'hihihih', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('ce881cc1-bd50-476b-962b-20358a5e9cf4', 1940000, 'VND', 'Tngoc restaurant', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL),
('d68fa7a1-be3c-4ec9-a60b-1524c2ad8ad7', 5000000, 'VND', 'main', 0, 0, 'basic', 'dd185a16-86f0-4577-90e4-0a65fefa1422', b'1', NULL),
('f8bc45c3-46d5-4aa3-b619-489b96997dc3', 500000, 'VND', 'hello', 0, 0, 'basic', '97648cdd-dd3c-4bfa-a1c1-3382dcd1814c', b'0', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8mr07uwrg7axijjdskks9f5md` (`recurring_id`),
  ADD KEY `FKk8vs7ac9xknv5xp18pdiehpp1` (`user_id`),
  ADD KEY `FK80ll1ydwsfes2hu4y5a12kxxy` (`wallet_id`),
  ADD KEY `FKnr5b7ieqyssgserr1nopm34ip` (`category_id`);

--
-- Indexes for table `bills_categories`
--
ALTER TABLE `bills_categories`
  ADD UNIQUE KEY `UKbrggeqr42iyp8tbt886b4410w` (`categories_id`),
  ADD KEY `FKn03l24pobjme1lvh0id7pewcu` (`bill_id`);

--
-- Indexes for table `budgets`
--
ALTER TABLE `budgets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKln0tm5tgf3f9q3sp9sa5m8m7b` (`user_id`),
  ADD KEY `FKbqfe00jqyk7wevfu9lxhlpjv0` (`category_id`),
  ADD KEY `FK8k3rkd2tnc4nn4lnl5xh9xbue` (`wallet_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnm1ryed47o3cihnlr9vhat5q5` (`budget_id`),
  ADD KEY `FK7ffrpnxaflomhdh0qfk2jcndo` (`user_id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKc42eihjtiryeriy8axlkpejo7` (`friend_id`),
  ADD KEY `FKlh21lfp7th1y1tn9g63ihkda9` (`user_id`);

--
-- Indexes for table `icon`
--
ALTER TABLE `icon`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsp1db43yf1nqhswrpbwmlnhb9` (`user_id`),
  ADD KEY `FK74fel9lb8lcdk14ldl3vy5cng` (`wallet_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recurring`
--
ALTER TABLE `recurring`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKhkjb2ehfqs0ow789415ek1y4f` (`bill_id`),
  ADD UNIQUE KEY `UK3vev7m8qhwvxvb0hlbc51rqsy` (`transaction_id`);

--
-- Indexes for table `transations`
--
ALTER TABLE `transations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr60cmvoxplv5fw062cbl7h8ir` (`recurring_id`),
  ADD KEY `FKoeif83jhyqeeeu1b5m74c0ccj` (`category_id`),
  ADD KEY `FK2q7sf0mciyt77d0rm9suf3wjn` (`user_id`),
  ADD KEY `FKfck2oxj1lfjnb3wvpt6pllmd3` (`wallet_id`),
  ADD KEY `FKh5jqnxac2w66wqla8qa93mo17` (`budget_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD KEY `FKc2d7aih8weit50jlu4q57cvs` (`user_id`),
  ADD KEY `FKi5naecliicmigrk01qx5me5sp` (`notification_id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKc1foyisidw7wqqrkamafuwn4e` (`user_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `FK80ll1ydwsfes2hu4y5a12kxxy` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`),
  ADD CONSTRAINT `FKi8q2l8hqnc4u73gs1jo6tywbe` FOREIGN KEY (`recurring_id`) REFERENCES `recurring` (`id`),
  ADD CONSTRAINT `FKk8vs7ac9xknv5xp18pdiehpp1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKnr5b7ieqyssgserr1nopm34ip` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Constraints for table `bills_categories`
--
ALTER TABLE `bills_categories`
  ADD CONSTRAINT `FK4wfihw1rpfs1knoelvj7t4txi` FOREIGN KEY (`categories_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FKn03l24pobjme1lvh0id7pewcu` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`);

--
-- Constraints for table `budgets`
--
ALTER TABLE `budgets`
  ADD CONSTRAINT `FK8k3rkd2tnc4nn4lnl5xh9xbue` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`),
  ADD CONSTRAINT `FKbqfe00jqyk7wevfu9lxhlpjv0` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FKln0tm5tgf3f9q3sp9sa5m8m7b` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `FK7ffrpnxaflomhdh0qfk2jcndo` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKnm1ryed47o3cihnlr9vhat5q5` FOREIGN KEY (`budget_id`) REFERENCES `budgets` (`id`);

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `FKc42eihjtiryeriy8axlkpejo7` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKlh21lfp7th1y1tn9g63ihkda9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `FK74fel9lb8lcdk14ldl3vy5cng` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`),
  ADD CONSTRAINT `FKsp1db43yf1nqhswrpbwmlnhb9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `recurring`
--
ALTER TABLE `recurring`
  ADD CONSTRAINT `FK9bnoa63s8kc4uc2akf74ue76u` FOREIGN KEY (`transaction_id`) REFERENCES `transations` (`id`),
  ADD CONSTRAINT `FKgi0ku491uvvv36d774tvl3sfy` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`);

--
-- Constraints for table `transations`
--
ALTER TABLE `transations`
  ADD CONSTRAINT `FK2q7sf0mciyt77d0rm9suf3wjn` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKfck2oxj1lfjnb3wvpt6pllmd3` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`),
  ADD CONSTRAINT `FKh5jqnxac2w66wqla8qa93mo17` FOREIGN KEY (`budget_id`) REFERENCES `budgets` (`id`),
  ADD CONSTRAINT `FKoeif83jhyqeeeu1b5m74c0ccj` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FKsgc6x58so2fbl9w87tundjy3i` FOREIGN KEY (`recurring_id`) REFERENCES `recurring` (`id`);

--
-- Constraints for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD CONSTRAINT `FKc2d7aih8weit50jlu4q57cvs` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKi5naecliicmigrk01qx5me5sp` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`id`);

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `FKc1foyisidw7wqqrkamafuwn4e` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
