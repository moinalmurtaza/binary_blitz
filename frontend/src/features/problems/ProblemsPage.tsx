import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink, Check } from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
  'Easy':   'text-green-500 bg-green-500/10 border-green-500/20',
  'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'Hard':   'text-red-500 bg-red-500/10 border-red-500/20',
};

function getDifficultyColor(difficulty: string) {
  return DIFFICULTY_COLORS[difficulty] || 'text-zinc-400 bg-zinc-800 border-zinc-700';
}

const SHEET_DATA = [
  {
    topic: 'Day 1: Arrays (Part 1)',
    description: 'Basic array manipulation, stock patterns, and mathematical algorithms.',
    problems: [
      { id: 'd1-1', title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
      { id: 'd1-2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'd1-3', title: 'Majority Element', difficulty: 'Easy', url: 'https://leetcode.com/problems/majority-element/' },
      { id: 'd1-4', title: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
      { id: 'd1-5', title: 'Merge Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-sorted-array/' }
    ]
  },
  {
    topic: 'Day 2: Arrays (Part 2)',
    description: 'Pointers, elements sorting, and positioning.',
    problems: [
      { id: 'd2-1', title: 'Move Zeroes', difficulty: 'Easy', url: 'https://leetcode.com/problems/move-zeroes/' },
      { id: 'd2-2', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 'd2-3', title: 'Sort Colors', difficulty: 'Medium', url: 'https://leetcode.com/problems/sort-colors/' },
      { id: 'd2-4', title: 'Squares of a Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/' }
    ]
  },
  {
    topic: 'Day 3: Arrays (Part 3)',
    description: 'Sorting combinations, multi-pointers, and permutations.',
    problems: [
      { id: 'd3-1', title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
      { id: 'd3-2', title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: 'd3-3', title: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'd3-4', title: 'Next Permutation', difficulty: 'Medium', url: 'https://leetcode.com/problems/next-permutation/' }
    ]
  },
  {
    topic: 'Day 4: Arrays (Part 4)',
    description: 'Matrix traversal, 2D search, and dynamic ranges.',
    problems: [
      { id: 'd4-1', title: 'Maximum Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'd4-2', title: 'Rotate Image', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotate-image/' },
      { id: 'd4-3', title: 'Spiral Matrix', difficulty: 'Medium', url: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'd4-4', title: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/' }
    ]
  },
  {
    topic: 'Day 5: Arrays (Part 5)',
    description: 'Search intervals, rotated sorting, and sliding windows.',
    problems: [
      { id: 'd5-1', title: 'Product of Array Except Self', difficulty: 'Medium', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'd5-2', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'd5-3', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'd5-4', title: '3Sum Closest', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum-closest/' }
    ]
  },
  {
    topic: 'Day 6: Strings (Part 1)',
    description: 'String manipulation, hashing comparisons, and pointers.',
    problems: [
      { id: 'd6-1', title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'd6-2', title: 'Valid Palindrome', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'd6-3', title: 'Longest Common Prefix', difficulty: 'Easy', url: 'https://leetcode.com/problems/longest-common-prefix/' },
      { id: 'd6-4', title: 'Reverse String', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-string/' }
    ]
  },
  {
    topic: 'Day 7: Strings (Part 2)',
    description: 'Sliding window, string hashing, and stack applications.',
    problems: [
      { id: 'd7-1', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'd7-2', title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'd7-3', title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'd7-4', title: 'Find the Index of the First Occurrence in a String', difficulty: 'Easy', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/' }
    ]
  },
  {
    topic: 'Day 8: Binary Search',
    description: 'Logarithmic search patterns and binary division.',
    problems: [
      { id: 'd8-1', title: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
      { id: 'd8-2', title: 'Search Insert Position', difficulty: 'Easy', url: 'https://leetcode.com/problems/search-insert-position/' },
      { id: 'd8-3', title: 'First Bad Version', difficulty: 'Easy', url: 'https://leetcode.com/problems/first-bad-version/' },
      { id: 'd8-4', title: 'Find Peak Element', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-peak-element/' }
    ]
  },
  {
    topic: 'Day 9: Recursion & Backtracking (Part 1)',
    description: 'Subset generation, combinations, and basic backtrack search.',
    problems: [
      { id: 'd9-1', title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/' },
      { id: 'd9-2', title: 'Permutations', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations/' },
      { id: 'd9-3', title: 'Combination Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'd9-4', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' }
    ]
  },
  {
    topic: 'Day 10: Backtracking (Part 2)',
    description: 'Constraint satisfaction, grid pathfinding, and optimization.',
    problems: [
      { id: 'd10-1', title: 'N-Queens', difficulty: 'Hard', url: 'https://leetcode.com/problems/n-queens/' },
      { id: 'd10-2', title: 'Sudoku Solver', difficulty: 'Hard', url: 'https://leetcode.com/problems/sudoku-solver/' },
      { id: 'd10-3', title: 'Generate Parentheses', difficulty: 'Medium', url: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'd10-4', title: 'Word Search II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/' }
    ]
  },
  {
    topic: 'Day 11: Linked List (Part 1)',
    description: 'Pointer manipulation, traversal, and basic operations.',
    problems: [
      { id: 'd11-1', title: 'Reverse Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'd11-2', title: 'Middle of the Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 'd11-3', title: 'Linked List Cycle', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'd11-4', title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' }
    ]
  },
  {
    topic: 'Day 12: Linked List (Part 2)',
    description: 'Floyd cycle detection, nodes merging, and lists removal.',
    problems: [
      { id: 'd12-1', title: 'Remove Nth Node From End of List', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'd12-2', title: 'Remove Linked List Elements', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-linked-list-elements/' },
      { id: 'd12-3', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { id: 'd12-4', title: 'Palindrome Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/palindrome-linked-list/' }
    ]
  },
  {
    topic: 'Day 13: Stacks & Queues (Part 1)',
    description: 'Implementation with templates, stacks, and monotonic sequences.',
    problems: [
      { id: 'd13-1', title: 'Implement Queue using Stacks', difficulty: 'Easy', url: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: 'd13-2', title: 'Implement Stack using Queues', difficulty: 'Easy', url: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { id: 'd13-3', title: 'Min Stack', difficulty: 'Easy', url: 'https://leetcode.com/problems/min-stack/' },
      { id: 'd13-4', title: 'Next Greater Element I', difficulty: 'Easy', url: 'https://leetcode.com/problems/next-greater-element-i/' }
    ]
  },
  {
    topic: 'Day 14: Stacks & Queues (Part 2)',
    description: 'Monotonic bounds, calculations, and optimization.',
    problems: [
      { id: 'd14-1', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'd14-2', title: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'd14-3', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' }
    ]
  },
  {
    topic: 'Day 15: Stacks & Queues (Part 3)',
    description: 'Sliding window maximum and caching strategies.',
    problems: [
      { id: 'd15-1', title: 'Sliding Window Maximum', difficulty: 'Hard', url: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 'd15-2', title: 'Online Stock Span', difficulty: 'Medium', url: 'https://leetcode.com/problems/online-stock-span/' },
      { id: 'd15-3', title: 'LRU Cache', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/' }
    ]
  },
  {
    topic: 'Day 16: Binary Trees (Part 1)',
    description: 'Tree properties, heights, and structural balances.',
    problems: [
      { id: 'd16-1', title: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'd16-2', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'd16-3', title: 'Diameter of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'd16-4', title: 'Balanced Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/balanced-binary-tree/' }
    ]
  },
  {
    topic: 'Day 17: Binary Trees (Part 2)',
    description: 'Tree structures, symmetries, and traversals.',
    problems: [
      { id: 'd17-1', title: 'Same Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/same-tree/' },
      { id: 'd17-2', title: 'Symmetric Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/symmetric-tree/' },
      { id: 'd17-3', title: 'Subtree of Another Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'd17-4', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' }
    ]
  },
  {
    topic: 'Day 18: Binary Trees (Part 3)',
    description: 'Path searches, ancestral nodes, and construction from traversals.',
    problems: [
      { id: 'd18-1', title: 'Path Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' },
      { id: 'd18-2', title: 'Path Sum III', difficulty: 'Medium', url: 'https://leetcode.com/problems/path-sum-iii/' },
      { id: 'd18-3', title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { id: 'd18-4', title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' }
    ]
  },
  {
    topic: 'Day 19: Binary Trees (Part 4)',
    description: 'Advanced paths, serialization, and link updates.',
    problems: [
      { id: 'd19-1', title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 'd19-2', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'd19-3', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      { id: 'd19-4', title: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium', url: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' }
    ]
  },
  {
    topic: 'Day 20: BST (Part 1)',
    description: 'Validations, searches, and properties of Binary Search Trees.',
    problems: [
      { id: 'd20-1', title: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'd20-2', title: 'Search in a Binary Search Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' },
      { id: 'd20-3', title: 'Insert into a Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/' },
      { id: 'd20-4', title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' }
    ]
  },
  {
    topic: 'Day 21: BST (Part 2)',
    description: 'Smallest items, deletions, and iterative traversals.',
    problems: [
      { id: 'd21-1', title: 'Kth Smallest Element in a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'd21-2', title: 'Delete Node in a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/delete-node-in-a-bst/' },
      { id: 'd21-3', title: 'Binary Search Tree Iterator', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-search-tree-iterator/' },
      { id: 'd21-4', title: 'Convert Sorted Array to Binary Search Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/' }
    ]
  },
  {
    topic: 'Day 22: BST (Part 3)',
    description: 'Recoveries, unique combinations, and tree trimming.',
    problems: [
      { id: 'd22-1', title: 'Recover Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/recover-binary-search-tree/' },
      { id: 'd22-2', title: 'Unique Binary Search Trees', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-binary-search-trees/' },
      { id: 'd22-3', title: 'Unique Binary Search Trees II', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-binary-search-trees-ii/' },
      { id: 'd22-4', title: 'Trim a Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/trim-a-binary-search-tree/' }
    ]
  },
  {
    topic: 'Day 23: Heaps',
    description: 'Priority elements extraction, lists merging, and streaming bounds.',
    problems: [
      { id: 'd23-1', title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'd23-2', title: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'd23-3', title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'd23-4', title: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/' }
    ]
  },
  {
    topic: 'Day 24: Tries',
    description: 'Implement prefixes, patterns search, and vocabulary processing.',
    problems: [
      { id: 'd24-1', title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 'd24-2', title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { id: 'd24-3', title: 'Replace Words', difficulty: 'Medium', url: 'https://leetcode.com/problems/replace-words/' },
      { id: 'd24-4', title: 'Word Search II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/' }
    ]
  },
  {
    topic: 'Day 25: Graphs (Part 1)',
    description: 'Cloning, basic schedules, BFS / DFS island patterns.',
    problems: [
      { id: 'd25-1', title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'd25-2', title: 'Course Schedule', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'd25-3', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'd25-4', title: 'Flood Fill', difficulty: 'Easy', url: 'https://leetcode.com/problems/flood-fill/' }
    ]
  },
  {
    topic: 'Day 26: Graphs (Part 2)',
    description: 'Topological sorting, cycle detections, and advanced BFS paths.',
    problems: [
      { id: 'd26-1', title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/' },
      { id: 'd26-2', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'd26-3', title: 'Number of Provinces', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-provinces/' },
      { id: 'd26-4', title: 'Word Ladder', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' }
    ]
  },
  {
    topic: 'Day 27: Graphs (Part 3)',
    description: 'Shortest paths (Dijkstra/Bellman), MST algorithms.',
    problems: [
      { id: 'd27-1', title: 'Rotting Oranges', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'd27-2', title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/' },
      { id: 'd27-3', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' }
    ]
  },
  {
    topic: 'Day 28: Graphs (Part 4)',
    description: 'Critical connections, alien ordering, and itineraries.',
    problems: [
      { id: 'd28-1', title: 'Critical Connections in a Network', difficulty: 'Hard', url: 'https://leetcode.com/problems/critical-connections-in-a-network/' },
      { id: 'd28-2', title: 'Alien Dictionary', difficulty: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/' },
      { id: 'd28-3', title: 'Reconstruct Itinerary', difficulty: 'Hard', url: 'https://leetcode.com/problems/reconstruct-itinerary/' },
      { id: 'd28-4', title: 'Longest Consecutive Sequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' }
    ]
  },
  {
    topic: 'Day 29: DP (Part 1)',
    description: 'Foundational subproblems, coins, steps, and robber models.',
    problems: [
      { id: 'd29-1', title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'd29-2', title: 'Min Cost Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
      { id: 'd29-3', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
      { id: 'd29-4', title: 'House Robber', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber/' }
    ]
  },
  {
    topic: 'Day 30: DP (Part 2)',
    description: 'Decodings, palindromic paths, and grid ways.',
    problems: [
      { id: 'd30-1', title: 'House Robber II', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'd30-2', title: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'd30-3', title: 'Decode Ways', difficulty: 'Medium', url: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'd30-4', title: 'Unique Paths', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths/' }
    ]
  },
  {
    topic: 'Day 31: DP (Part 3)',
    description: 'LIS patterns, subset sums, and edit string alignments.',
    problems: [
      { id: 'd31-1', title: 'Word Break', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-break/' },
      { id: 'd31-2', title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'd31-3', title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      { id: 'd31-4', title: 'Edit Distance', difficulty: 'Hard', url: 'https://leetcode.com/problems/edit-distance/' }
    ]
  },
  {
    topic: 'Day 32: DP (Part 4)',
    description: 'Maximum submatrices, LCS patterns, and game strategies.',
    problems: [
      { id: 'd32-1', title: 'Maximal Square', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximal-square/' },
      { id: 'd32-2', title: 'Longest Common Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'd32-3', title: 'Target Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/target-sum/' },
      { id: 'd32-4', title: 'Burst Balloons', difficulty: 'Hard', url: 'https://leetcode.com/problems/burst-balloons/' }
    ]
  },
  {
    topic: 'Day 33: Greedy',
    description: 'Interval alignments, cookies collections, and gas optimization.',
    problems: [
      { id: 'd33-1', title: 'Assign Cookies', difficulty: 'Easy', url: 'https://leetcode.com/problems/assign-cookies/' },
      { id: 'd33-2', title: 'Gas Station', difficulty: 'Medium', url: 'https://leetcode.com/problems/gas-station/' },
      { id: 'd33-3', title: 'Lemonade Change', difficulty: 'Easy', url: 'https://leetcode.com/problems/lemonade-change/' },
      { id: 'd33-4', title: 'Non-overlapping Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/' }
    ]
  },
  {
    topic: 'Day 34: Miscellaneous',
    description: 'Bitwise algorithms, math tricks, and general problem types.',
    problems: [
      { id: 'd34-1', title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/' },
      { id: 'd34-2', title: 'Majority Element', difficulty: 'Easy', url: 'https://leetcode.com/problems/majority-element/' },
      { id: 'd34-3', title: 'Pow(x, n)', difficulty: 'Medium', url: 'https://leetcode.com/problems/powx-n/' },
      { id: 'd34-4', title: 'LRU Cache', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/' }
    ]
  }
];

export default function ProblemsPage() {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'Day 1: Arrays (Part 1)': true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('dsa-sheet-progress');
    if (saved) {
      try { setSolved(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const toggleProblem = (id: string) => {
    setSolved(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('dsa-sheet-progress', JSON.stringify(next));
      return next;
    });
  };

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const totalProblems = SHEET_DATA.reduce((acc, topic) => acc + topic.problems.length, 0);
  const totalSolved = Object.values(solved).filter(Boolean).length;
  const overallProgress = Math.round((totalSolved / totalProblems) * 100) || 0;

  return (
    <div className="max-w-5xl mx-auto font-sans text-white pb-20">
      
      {/* Header & Overall Progress */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">DSA Training Sheet</h1>
        <p className="text-[#C8C8C8] text-lg font-serif mb-8 max-w-3xl leading-relaxed">
          A comprehensive, curated list of algorithmic problems designed to systematically build your problem-solving skills, inspired by top university curriculums and industry standards.
        </p>

        {/* Progress Bar */}
        <div className="harvard-card p-6 bg-[#33363B] border border-[#4B4F55]">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[#9A9A9A] text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">Overall Progress</span>
              <span className="font-serif text-3xl font-medium">{totalSolved} <span className="text-[#9A9A9A] text-xl">/ {totalProblems} solved</span></span>
            </div>
            <span className="text-[#A41034] font-serif text-2xl font-medium italic">{overallProgress}%</span>
          </div>
          <div className="h-2 w-full bg-[#1A1C1F] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#A41034]"
            />
          </div>
        </div>
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-4">
        {SHEET_DATA.map((group) => {
          const groupSolved = group.problems.filter(p => solved[p.id]).length;
          const groupTotal = group.problems.length;
          const isExpanded = expandedTopics[group.topic];

          return (
            <div key={group.topic} className="harvard-card bg-[#33363B] border border-[#4B4F55] overflow-hidden">
              {/* Topic Header */}
              <button 
                onClick={() => toggleTopic(group.topic)}
                className="w-full text-left p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#3A3E44] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <ChevronRight size={18} className={`text-[#A41034] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    <h2 className="font-serif text-2xl font-medium">{group.topic}</h2>
                  </div>
                  <p className="text-[#9A9A9A] text-sm pl-8">{group.description}</p>
                </div>

                {/* Mini Progress */}
                <div className="pl-8 md:pl-0 flex items-center gap-4 shrink-0">
                  <span className="text-sm font-sans font-medium text-[#C8C8C8] w-12 text-right">
                    {groupSolved} / {groupTotal}
                  </span>
                  <div className="w-24 h-1.5 bg-[#1A1C1F] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#A41034] transition-all duration-500"
                      style={{ width: `${(groupSolved / groupTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Problems Table */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-[#4B4F55]"
                  >
                    <table className="w-full text-left text-sm font-sans">
                      <thead>
                        <tr className="bg-[#2A2D32]">
                          <th className="w-16 px-6 py-3 text-[10px] uppercase tracking-widest text-[#9A9A9A] font-bold">Done</th>
                          <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#9A9A9A] font-bold">Problem</th>
                          <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#9A9A9A] font-bold hidden sm:table-cell">Difficulty</th>
                          <th className="w-20 px-6 py-3 text-[10px] uppercase tracking-widest text-[#9A9A9A] font-bold text-center">Solve</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.problems.map((problem) => {
                          const isSolved = solved[problem.id];
                          return (
                            <tr key={problem.id} className="border-t border-[#4B4F55]/50 hover:bg-[#3A3E44]/50 transition-colors">
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => toggleProblem(problem.id)}
                                  className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                                    isSolved 
                                      ? 'bg-[#A41034] border-[#A41034] text-white' 
                                      : 'border-[#6B6B6B] hover:border-[#A41034]'
                                  }`}
                                >
                                  {isSolved && <Check size={14} strokeWidth={3} />}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <a 
                                  href={problem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`font-semibold hover:text-[#A41034] transition-colors ${isSolved ? 'text-[#9A9A9A] line-through' : 'text-[#E0E0E0]'}`}
                                >
                                  {problem.title}
                                </a>
                              </td>
                              <td className="px-6 py-4 hidden sm:table-cell">
                                <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold border ${getDifficultyColor(problem.difficulty)} ${isSolved ? 'opacity-50' : ''}`}>
                                  {problem.difficulty}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <a 
                                  href={problem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex p-2 text-[#9A9A9A] hover:text-white hover:bg-[#A41034]/20 rounded transition-colors"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
