package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/fatih/color"
)

var serviceConfig = struct {
	Port        int
	URL         string
	ServiceName string
}{
	Port:        3030,
	URL:         "127.0.0.1",
	ServiceName: "Example software name",
}

func ipify() (string, error) {
	resp, err := http.Get("https://api.ipify.org")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func licenceChecker() {
	fmt.Println("Checking if you have already activated the software...")
	myIP, err := ipify()
	if err != nil {
		fmt.Println("Failed to get IP address:", err)
		return
	}

	if _, err := os.Stat("key.db"); os.IsNotExist(err) {
		get()
		return
	}

	keyData, err := ioutil.ReadFile("key.db")
	if err != nil {
		fmt.Println("Failed to read key file:", err)
		return
	}
	key := strings.Split(string(keyData), "\n")[0]

	jsonData := map[string]interface{}{
		"adminKey": "unknown",
		"ip":       myIP,
		"key":      key,
		"tor":      "LOGIN_KEY",
	}
	jsonValue, _ := json.Marshal(jsonData)

	resp, err := http.Post(fmt.Sprintf("http://%s:%d/api/json", serviceConfig.URL, serviceConfig.Port), "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("Failed to send request to server:", err)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("Failed to decode server response:", err)
		return
	}

	status := result["title"].(string)
	if status == "Successful" {
		fmt.Printf("Yeah, %s is activated!\n", serviceConfig.ServiceName)
		fmt.Println("-----> Starting The Software...")
		start()
	} else {
		if status == "Bad ip with your key !" {
			start()
		} else {
			get()
		}
	}
}

func get() {
	myIP, err := ipify()
	if err != nil {
		fmt.Println("Failed to get IP address:", err)
		return
	}

	fmt.Printf("Hey, %s is not free! Do you have a key? If you're here, I think yes! Please type your key:\n", serviceConfig.ServiceName)

	var key string
	fmt.Print(color.RedString("key ~> "))
	fmt.Scanln(&key)

	fmt.Println(color.GreenString("[API]") + " >> Checking if your key is available")

	jsonData := map[string]interface{}{
		"adminKey": "unknown",
		"ip":       myIP,
		"key":      key,
		"tor":      "LOGIN_KEY",
	}
	jsonValue, _ := json.Marshal(jsonData)

	resp, err := http.Post(fmt.Sprintf("http://%s:%d/api/json", serviceConfig.URL, serviceConfig.Port), "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("Failed to send request to server:", err)
		return
	}
	defer resp.Body.Close()

	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return
	}

	// Decode JSON response
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Println("Failed to decode server response:", err)
		return
	}

	status, ok := result["title"].(string)
	if !ok {
		fmt.Println("Invalid server response format")
		return
	}

	if status == "Successful" {
		fmt.Printf("Yeah, you just activated %s, gg!\n", serviceConfig.ServiceName)
		if err := os.WriteFile("key.db", []byte(fmt.Sprintf("%s\nby Kisakay with <3", key)), 0644); err != nil {
			fmt.Println("Failed to write key file:", err)
			return
		}
		start()
	} else if status == "Your key is not available !" {
		fmt.Println(color.RedString("No, this key is not correct! Please contact support if you don't have a key!"))
	} else if status == "Bad ip with your key !" {
		fmt.Println(color.RedString("Your key is not associated with this IP! Please disable your VPN or switch to a classical connection!"))
		fmt.Println("For more information, please contact support! If you don't know, 1 key is for 1 person!")
	}
}

func start() {
	// Your Software Here
}

func main() {
	licenceChecker()
}
