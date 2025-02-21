package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

type ServiceConfig struct {
	Port        int    `json:"port"`
	URL         string `json:"url"`
	ServiceName string `json:"serviceName"`
}

type LicenseRequest struct {
	Key string `json:"key"`
}

type LicenseResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

var serviceConfig = ServiceConfig{
	Port:        3030,
	URL:         "127.0.0.1",
	ServiceName: "Example software name",
}

func main() {
	licenceChecker()
}

func licenceChecker() {
	fmt.Println("Checking if you are already activate the software...")

	if _, err := os.Stat("key.db"); os.IsNotExist(err) {
		get()
	} else {
		data, err := ioutil.ReadFile("key.db")
		if err != nil {
			fmt.Println("Error reading key file:", err)
			get()
			return
		}

		if len(data) > 0 {
			lines := strings.Split(string(data), "\n")
			
			licenseReq := LicenseRequest{
				Key: lines[0],
			}
			
			reqBody, err := json.Marshal(licenseReq)
			if err != nil {
				fmt.Println("Error marshaling request:", err)
				return
			}

			resp, err := http.Post(
				fmt.Sprintf("http://%s:%d/license/login", serviceConfig.URL, serviceConfig.Port),
				"application/json; charset=UTF-8",
				bytes.NewBuffer(reqBody),
			)
			
			if err != nil {
				fmt.Println("Error making request:", err)
				return
			}
			defer resp.Body.Close()

			var states LicenseResponse
			body, _ := ioutil.ReadAll(resp.Body)
			json.Unmarshal(body, &states)

			if states.Success {
				fmt.Printf("Yeah, %s is activate !\n", serviceConfig.ServiceName)
				fmt.Println("-----> Starting The Software...")
				start()
			} else {
				if states.Error == "Bad ip with your key !" {
					start()
				} else {
					get()
				}
			}
		}
	}
}

func get() {
	fmt.Printf("Hey, %s is not free ! Do you have key? If you here, i think is yes ! Type you key please :\n", serviceConfig.ServiceName)
	fmt.Print("key ~> ")
	
	var answer string
	fmt.Scanln(&answer)
	
	fmt.Println("[API] >> Checking if your key is available")

	licenseReq := LicenseRequest{
		Key: answer,
	}
	
	reqBody, err := json.Marshal(licenseReq)
	if err != nil {
		fmt.Println("Error marshaling request:", err)
		return
	}

	resp, err := http.Post(
		fmt.Sprintf("http://%s:%d/license/login", serviceConfig.URL, serviceConfig.Port),
		"application/json; charset=UTF-8",
		bytes.NewBuffer(reqBody),
	)
	
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	var states LicenseResponse
	body, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(body, &states)

	if states.Success {
		fmt.Printf("Yeah, you just activate %s, gg !\n", serviceConfig.ServiceName)
		
		// Writing to db
		err := ioutil.WriteFile("key.db", []byte(fmt.Sprintf("%s\nby Kisakay with <3", answer)), 0644)
		if err != nil {
			fmt.Println("Error writing key file:", err)
			return
		}
		
		start()
		return
	}
	
	if states.Error == "Key doesn't exist" {
		fmt.Println("No, this key is not correct ! Please contact support, if you don't have key !")
		os.Exit(1)
	} else if states.Error == "Bad ip with your key !" {
		fmt.Println("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !")
		os.Exit(1)
	}
}

func start() {
	// Your Software Here:
}

// made by Kisakay