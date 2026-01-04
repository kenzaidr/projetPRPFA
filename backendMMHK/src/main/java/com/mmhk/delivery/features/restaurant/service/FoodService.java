package com.mmhk.delivery.features.restaurant.service;


import com.mmhk.delivery.features.restaurant.model.Food;
import com.mmhk.delivery.features.restaurant.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getFoodsByRestaurant(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }

    public List<Food> searchFoods(String query) {
        return foodRepository.findByNameContainingIgnoreCase(query);
    }

    public Food createFood(Food food) {
        return foodRepository.save(food);
    }
}
