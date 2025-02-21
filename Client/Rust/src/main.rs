use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, Write};
use std::process;

#[derive(Serialize, Deserialize, Debug)]
struct ServiceConfig {
    port: u16,
    url: String,
    service_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct LicenseRequest {
    key: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct LicenseResponse {
    success: Option<bool>,
    error: Option<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let service_config = ServiceConfig {
        port: 3030,
        url: String::from("127.0.0.1"),
        service_name: String::from("Example software name"),
    };

    licence_checker(&service_config)?;
    Ok(())
}

fn licence_checker(config: &ServiceConfig) -> Result<(), Box<dyn std::error::Error>> {
    println!("Checking if you are already activate the software...");

    if !std::path::Path::new("key.db").exists() {
        get(config)?;
    } else {
        match fs::read_to_string("key.db") {
            Ok(data) if !data.is_empty() => {
                let lines: Vec<&str> = data.split('\n').collect();
                let client = Client::new();

                let license_req = LicenseRequest {
                    key: lines[0].to_string(),
                };

                let url = format!(
                    "http://{}:{}/license/login",
                    config.url, config.port
                );
                
                match client.post(&url)
                    .json(&license_req)
                    .header("Content-type", "application/json; charset=UTF-8")
                    .send() {
                    Ok(response) => {
                        match response.json::<LicenseResponse>() {
                            Ok(states) => {
                                if let Some(true) = states.success {
                                    println!("Yeah, {} is activate !", config.service_name);
                                    println!("-----> Starting The Software...");
                                    start();
                                } else {
                                    if states.error.as_deref() == Some("Bad ip with your key !") {
                                        start();
                                    } else {
                                        get(config)?;
                                    }
                                }
                            },
                            Err(e) => println!("Error parsing response: {}", e),
                        }
                    },
                    Err(e) => println!("Error making request: {}", e),
                }
            },
            _ => get(config)?,
        }
    }
    
    Ok(())
}

fn get(config: &ServiceConfig) -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "Hey, {} is not free ! Do you have key? If you here, i think is yes ! Type you key please :",
        config.service_name
    );
    
    print!("key ~> ");
    io::stdout().flush()?;
    
    let mut answer = String::new();
    io::stdin().read_line(&mut answer)?;
    let answer = answer.trim();
    
    println!("[API] >> Checking if your key is available");

    let client = Client::new();
    let license_req = LicenseRequest {
        key: answer.to_string(),
    };

    let url = format!(
        "http://{}:{}/license/login",
        config.url, config.port
    );
    
    let response = client.post(&url)
        .json(&license_req)
        .header("Content-type", "application/json; charset=UTF-8")
        .send()?;
    
    let states: LicenseResponse = response.json()?;

    if let Some(true) = states.success {
        println!("Yeah, you just activate {}, gg !", config.service_name);
        
        // Writing to db
        fs::write("key.db", format!("{}\nby Kisakay with <3", answer))?;
        
        start();
        return Ok(());
    }
    
    if states.error.as_deref() == Some("Key doesn't exist") {
        println!("No, this key is not correct ! Please contact support, if you don't have key !");
        process::exit(1);
    } else if states.error.as_deref() == Some("Bad ip with your key !") {
        println!("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !");
        process::exit(1);
    }
    
    Ok(())
}

fn start() {
    // Your Software Here:
}

// made by Kisakay