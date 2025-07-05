import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export class RecommendationEngine {
  constructor() {
    this.userBehavior = this.loadUserBehavior();
    this.productCatalog = [];
    this.recommendations = [];
  }

  // Load user behavior from localStorage
  loadUserBehavior() {
    const saved = localStorage.getItem('user_behavior');
    return saved ? JSON.parse(saved) : {
      viewedProducts: [],
      purchasedProducts: [],
      searchHistory: [],
      categoryPreferences: {},
      priceRange: { min: 0, max: 1000 },
      sessionData: {
        timeSpent: {},
        clickedElements: [],
        scrollDepth: {}
      }
    };
  }

  // Save user behavior to localStorage
  saveUserBehavior() {
    localStorage.setItem('user_behavior', JSON.stringify(this.userBehavior));
  }

  // Track product view
  trackProductView(productId, productData) {
    const viewData = {
      productId,
      timestamp: new Date().toISOString(),
      category: productData.category,
      price: productData.price,
      tags: productData.tags || []
    };

    // Add to viewed products (keep last 50)
    this.userBehavior.viewedProducts.unshift(viewData);
    this.userBehavior.viewedProducts = this.userBehavior.viewedProducts.slice(0, 50);

    // Update category preferences
    if (productData.category) {
      this.userBehavior.categoryPreferences[productData.category] = 
        (this.userBehavior.categoryPreferences[productData.category] || 0) + 1;
    }

    // Update price range preferences
    this.updatePricePreferences(productData.price);
    
    this.saveUserBehavior();
  }

  // Track purchase
  trackPurchase(productId, productData) {
    const purchaseData = {
      productId,
      timestamp: new Date().toISOString(),
      category: productData.category,
      price: productData.price,
      tags: productData.tags || []
    };

    this.userBehavior.purchasedProducts.push(purchaseData);
    
    // Increase category preference weight for purchases
    if (productData.category) {
      this.userBehavior.categoryPreferences[productData.category] = 
        (this.userBehavior.categoryPreferences[productData.category] || 0) + 3;
    }

    this.saveUserBehavior();
  }

  // Update price preferences based on viewed/purchased products
  updatePricePreferences(price) {
    const viewedPrices = this.userBehavior.viewedProducts.map(p => p.price);
    const purchasedPrices = this.userBehavior.purchasedProducts.map(p => p.price);
    const allPrices = [...viewedPrices, ...purchasedPrices, price];

    if (allPrices.length > 0) {
      const sortedPrices = allPrices.sort((a, b) => a - b);
      this.userBehavior.priceRange = {
        min: Math.min(...sortedPrices),
        max: Math.max(...sortedPrices)
      };
    }
  }

  // Generate recommendations based on different algorithms
  async generateRecommendations(currentProductId = null, limit = 6) {
    const recommendations = [];

    // 1. Collaborative Filtering (Users who bought this also bought)
    const collaborativeRecs = await this.getCollaborativeRecommendations(currentProductId);
    recommendations.push(...collaborativeRecs);

    // 2. Content-Based Filtering (Similar products)
    const contentRecs = await this.getContentBasedRecommendations(currentProductId);
    recommendations.push(...contentRecs);

    // 3. Category-Based Recommendations
    const categoryRecs = await this.getCategoryBasedRecommendations();
    recommendations.push(...categoryRecs);

    // 4. Price-Based Recommendations
    const priceRecs = await this.getPriceBasedRecommendations();
    recommendations.push(...priceRecs);

    // 5. Trending Products
    const trendingRecs = await this.getTrendingRecommendations();
    recommendations.push(...trendingRecs);

    // Remove duplicates and current product
    const uniqueRecs = this.removeDuplicates(recommendations, currentProductId);

    // Score and sort recommendations
    const scoredRecs = this.scoreRecommendations(uniqueRecs);

    return scoredRecs.slice(0, limit);
  }

  // Collaborative filtering recommendations
  async getCollaborativeRecommendations(currentProductId) {
    try {
      const response = await fetch('/api/recommendations/collaborative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProductId,
          userBehavior: this.userBehavior
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error fetching collaborative recommendations:', error);
    }

    // Fallback: Mock collaborative recommendations
    return this.getMockCollaborativeRecommendations(currentProductId);
  }

  // Content-based filtering recommendations
  async getContentBasedRecommendations(currentProductId) {
    if (!currentProductId) return [];

    try {
      const response = await fetch(`/api/recommendations/content-based/${currentProductId}`);
      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error fetching content-based recommendations:', error);
    }

    return this.getMockContentBasedRecommendations(currentProductId);
  }

  // Category-based recommendations
  async getCategoryBasedRecommendations() {
    const topCategories = Object.entries(this.userBehavior.categoryPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    if (topCategories.length === 0) return [];

    try {
      const response = await fetch('/api/recommendations/category-based', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: topCategories })
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error fetching category-based recommendations:', error);
    }

    return this.getMockCategoryRecommendations(topCategories);
  }

  // Price-based recommendations
  async getPriceBasedRecommendations() {
    const { min, max } = this.userBehavior.priceRange;
    const priceBuffer = (max - min) * 0.3; // 30% buffer

    try {
      const response = await fetch('/api/recommendations/price-based', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minPrice: Math.max(0, min - priceBuffer),
          maxPrice: max + priceBuffer
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error fetching price-based recommendations:', error);
    }

    return this.getMockPriceRecommendations(min, max);
  }

  // Trending products recommendations
  async getTrendingRecommendations() {
    try {
      const response = await fetch('/api/recommendations/trending');
      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error fetching trending recommendations:', error);
    }

    return this.getMockTrendingRecommendations();
  }

  // Remove duplicates and current product
  removeDuplicates(recommendations, currentProductId) {
    const seen = new Set();
    const unique = [];

    for (const rec of recommendations) {
      if (rec.id !== currentProductId && !seen.has(rec.id)) {
        seen.add(rec.id);
        unique.push(rec);
      }
    }

    return unique;
  }

  // Score recommendations based on user behavior
  scoreRecommendations(recommendations) {
    return recommendations.map(rec => {
      let score = rec.baseScore || 0;

      // Category preference bonus
      if (rec.category && this.userBehavior.categoryPreferences[rec.category]) {
        score += this.userBehavior.categoryPreferences[rec.category] * 0.1;
      }

      // Price preference bonus
      const { min, max } = this.userBehavior.priceRange;
      if (rec.price >= min && rec.price <= max) {
        score += 0.2;
      }

      // Recently viewed category bonus
      const recentViews = this.userBehavior.viewedProducts.slice(0, 10);
      const recentCategories = recentViews.map(v => v.category);
      if (recentCategories.includes(rec.category)) {
        score += 0.15;
      }

      // Popularity bonus
      if (rec.salesCount > 100) {
        score += 0.1;
      }

      // Rating bonus
      if (rec.rating >= 4.5) {
        score += 0.05;
      }

      return { ...rec, score };
    }).sort((a, b) => b.score - a.score);
  }

  // Mock data methods for development
  getMockCollaborativeRecommendations(currentProductId) {
    return [
      {
        id: 'collab-1',
        name: 'Curso de Marketing Digital Avançado',
        price: 297.00,
        category: 'marketing',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        rating: 4.8,
        salesCount: 1250,
        baseScore: 0.9,
        reason: 'Quem comprou este produto também comprou'
      },
      {
        id: 'collab-2',
        name: 'Pack de Templates Premium',
        price: 97.00,
        category: 'design',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop',
        rating: 4.9,
        salesCount: 890,
        baseScore: 0.8,
        reason: 'Frequentemente comprado junto'
      }
    ];
  }

  getMockContentBasedRecommendations(currentProductId) {
    return [
      {
        id: 'content-1',
        name: 'Automação de Marketing',
        price: 197.00,
        category: 'marketing',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        rating: 4.7,
        salesCount: 650,
        baseScore: 0.85,
        reason: 'Similar ao produto atual'
      }
    ];
  }

  getMockCategoryRecommendations(categories) {
    return [
      {
        id: 'cat-1',
        name: 'Estratégias de Vendas Online',
        price: 147.00,
        category: categories[0] || 'marketing',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
        rating: 4.6,
        salesCount: 420,
        baseScore: 0.75,
        reason: 'Baseado em suas preferências'
      }
    ];
  }

  getMockPriceRecommendations(min, max) {
    const avgPrice = (min + max) / 2;
    return [
      {
        id: 'price-1',
        name: 'Curso de E-commerce',
        price: avgPrice,
        category: 'business',
        image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&h=200&fit=crop',
        rating: 4.5,
        salesCount: 320,
        baseScore: 0.7,
        reason: 'Na sua faixa de preço'
      }
    ];
  }

  getMockTrendingRecommendations() {
    return [
      {
        id: 'trend-1',
        name: 'IA para Negócios',
        price: 497.00,
        category: 'technology',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop',
        rating: 4.9,
        salesCount: 1890,
        baseScore: 0.95,
        reason: 'Produto em alta'
      }
    ];
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();