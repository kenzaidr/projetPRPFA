package com.mmhk.delivery.features.restaurant.controller;


import com.mmhk.delivery.features.restaurant.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private FoodRepository foodRepository;

    @GetMapping("/food-count")
    public String getFoodCount() {
        long count = foodRepository.count();
        return "Nombre de plats dans la base: " + count;
    }
}
