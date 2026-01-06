package com.mmhk.delivery.features.restaurant.controller;


import com.mmhk.delivery.features.restaurant.model.Restaurant;
import com.mmhk.delivery.features.restaurant.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin("*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id);
    }

    @GetMapping("/category/{category}")
    public List<Restaurant> getByCategory(@PathVariable String category) {
        return restaurantService.getRestaurantsByCategory(category);
    }

    @GetMapping("/search")
    public List<Restaurant> searchRestaurants(@RequestParam String query) {
        return restaurantService.searchRestaurants(query);
    }

    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.createRestaurant(restaurant);
    }
}