package com.mmhk.delivery.features.restaurant.controller;

import com.mmhk.delivery.features.restaurant.model.Food;
import com.mmhk.delivery.features.restaurant.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/foods")
@CrossOrigin("*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Food> getFoodsByRestaurant(@PathVariable Long restaurantId) {
        return foodService.getFoodsByRestaurant(restaurantId);
    }

    @GetMapping("/search")
    public List<Food> searchFoods(@RequestParam String query) {
        return foodService.searchFoods(query);
    }

    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return foodService.createFood(food);
    }
}