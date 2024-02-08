use std::error::Error;
use std::fs;
use std::io::{self, Write};
use colored::*;
use serde_json::json;

const SERVICE_CONFIG: &str = r#"{
    "port": 3030,
    "url": "127.0.0.1",
    "service_name": "Example software name"
}"#;

const IPIFY_ENDPOINT_IPV4: &str = "https://api.ipify.org";
const IPIFY_ENDPOINT_IPV6: &str = "https://api6.ipify.org";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let service_config: serde_json::Value = serde_json::from_str(SERVICE_CONFIG)?;

    println!("{}", "Checking if you are already activate the software...".yellow());
    let my_ip = ipify(false).await?;

    if !fs::metadata("key.db").is_ok() {
        get().await?;
    } else {
        let data = fs::read_to_string("key.db")?;
        if !data.is_empty() {
            let lines: Vec<&str> = data.split("\n").collect();
            let response = check_license(&service_config, &my_ip, &lines[0]).await?;
            let status_srv = response["title"].as_str().unwrap_or("");

            if status_srv == "Succeful" {
                println!("{}", format!("Yeah, {} is activate !", service_config["service_name"].as_str().unwrap()).green().bold());
                println!("{}", "-----> Starting The Software...".green().bold());
                // starting...
                start();
            } else {
                if status_srv == "Bad ip with your key !" {
                    start();
                } else {
                    get().await?;
                }
            }
        }
    }
    Ok(())
}

async fn ipify(use_ipv6: bool) -> Result<String, Box<dyn Error>> {
    let endpoint = if use_ipv6 {
        IPIFY_ENDPOINT_IPV6
    } else {
        IPIFY_ENDPOINT_IPV4
    };

    let response = reqwest::get(endpoint).await?;
    let ip = response.text().await?;
    Ok(ip)
}

async fn check_license(service_config: &serde_json::Value, my_ip: &str, key: &str) -> Result<serde_json::Value, Box<dyn Error>> {
    let client = reqwest::Client::new();
    let url = format!(
        "http://{}:{}/api/json",
        service_config["url"].as_str().unwrap(),
        service_config["port"].as_u64().unwrap()
    );
    let body = json!({
        "adminKey": "unknow",
        "ip": my_ip,
        "key": key,
        "tor": "LOGIN_KEY"
    });

    let response = client.post(&url).json(&body).send().await?;
    let response_body = response.text().await?;
    let response_json: serde_json::Value = serde_json::from_str(&response_body)?;
    Ok(response_json)
}

async fn get() -> Result<(), Box<dyn Error>> {
    let service_config: serde_json::Value = serde_json::from_str(SERVICE_CONFIG)?;
    let my_ip = ipify(false).await?;
    print!("{}", format!("Hey, {} is not free ! Do you have key? If you here, i think is yes ! Type you key please :", "Example software name").red());
    print!("{}", "key ~> ".blue());
    io::stdout().flush()?;
    let mut answer = String::new();
    io::stdin().read_line(&mut answer)?;

    println!("{}", "[API] >> Checking if your key is available".green());
    let response = check_license(&service_config, &my_ip, &answer).await?;
    let status_srv = response["title"].as_str().unwrap_or("");

    if status_srv == "Succeful" {
        println!("{}", format!("Yeah, you just activate {}, gg !", service_config["service_name"].as_str().unwrap()).green().bold());
        // writing in db
        fs::write("key.db", format!("{}\nby Kisakay with <3", answer))?;
        // the software:
        start();
    } else if status_srv == "Your key is not unvailable !" {
        println!("{}", "No, this key is not correct ! Please contact support, if you don't have key !".red().bold());
    } else if status_srv == "Bad ip with your key !" {
        println!("{}", "Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !".red().bold());
    }

    Ok(())
}

fn start() {
    // Your Software Here
}

