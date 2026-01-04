package com.mmhk.delivery.features.restaurant.repository;

import com.mmhk.delivery.features.restaurant.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    // Trouver tous les plats d'un restaurant
    List<Food> findByRestaurantId(Long restaurantId);

    // Rechercher par nom (insensible à la casse)
    List<Food> findByNameContainingIgnoreCase(String name);

    // Trouver par catégorie de restaurant
    @Query("SELECT f FROM Food f WHERE f.restaurant.category = :category")
    List<Food> findByRestaurantCategory(@Param("category") String category);

    // Trouver les plats disponibles
    List<Food> findByAvailableTrue();

    // Trouver les plats par restaurant et disponibilité
    List<Food> findByRestaurantIdAndAvailableTrue(Long restaurantId);

    // Trouver les plats par prix (inférieur ou égal)
    List<Food> findByPriceLessThanEqual(Double maxPrice);

    // Trouver les plats par prix (entre min et max)
    List<Food> findByPriceBetween(Double minPrice, Double maxPrice);

    // Recherche avancée: nom + restaurant
    List<Food> findByNameContainingIgnoreCaseAndRestaurantId(String name, Long restaurantId);

    // Compter les plats d'un restaurant
    Long countByRestaurantId(Long restaurantId);

    // Trouver les plats les plus populaires (par restaurant)
    @Query("SELECT f FROM Food f WHERE f.restaurant.id = :restaurantId ORDER BY f.id DESC")
    List<Food> findLatestByRestaurant(@Param("restaurantId") Long restaurantId, org.springframework.data.domain.Pageable pageable);
}