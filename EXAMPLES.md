# API Examples - Different Programming Languages

## JavaScript (Node.js)

### Basic Screenshot
```javascript
const response = await fetch(
  'http://localhost:3000/screenshot?url=https://example.com'
);
const data = await response.json();

if (data.success) {
  const base64Image = data.data.image;
  console.log('Screenshot size:', data.data.size, 'bytes');
  
  // Save to file
  const fs = require('fs');
  const buffer = Buffer.from(base64Image, 'base64');
  fs.writeFileSync('screenshot.png', buffer);
}
```

### Full Page Screenshot
```javascript
const axios = require('axios');

const response = await axios.get('http://localhost:3000/screenshot', {
  params: {
    url: 'https://github.com',
    fullPage: true,
    width: 1366,
    height: 768
  }
});

console.log('Processing time:', response.data.metadata.processingTime);
```

### Display in Browser
```javascript
fetch('http://localhost:3000/screenshot?url=https://example.com')
  .then(res => res.json())
  .then(data => {
    const img = document.getElementById('screenshot');
    img.src = `data:image/${data.data.format};base64,${data.data.image}`;
  });
```

---

## Python

### Using requests
```python
import requests
import base64
from io import BytesIO
from PIL import Image

# Make request
response = requests.get(
    'http://localhost:3000/screenshot',
    params={
        'url': 'https://example.com',
        'width': 1920,
        'height': 1080,
        'format': 'png'
    }
)

data = response.json()

if data['success']:
    # Decode Base64
    img_data = base64.b64decode(data['data']['image'])
    
    # Save to file
    with open('screenshot.png', 'wb') as f:
        f.write(img_data)
    
    # Or open with PIL
    img = Image.open(BytesIO(img_data))
    img.show()
    
    print(f"Size: {data['data']['size']} bytes")
    print(f"Time: {data['metadata']['processingTime']}")
```

### Full Page JPEG
```python
import requests
import base64

response = requests.get(
    'http://localhost:3000/screenshot',
    params={
        'url': 'https://github.com',
        'fullPage': True,
        'format': 'jpeg',
        'quality': 90
    }
)

data = response.json()
img_bytes = base64.b64decode(data['data']['image'])

with open('screenshot.jpg', 'wb') as f:
    f.write(img_bytes)
```

---

## PHP

### Basic Screenshot
```php
<?php

$url = 'http://localhost:3000/screenshot';
$params = [
    'url' => 'https://example.com',
    'width' => 1920,
    'height' => 1080
];

$response = file_get_contents($url . '?' . http_build_query($params));
$data = json_decode($response, true);

if ($data['success']) {
    $imageData = base64_decode($data['data']['image']);
    file_put_contents('screenshot.png', $imageData);
    
    echo "Screenshot saved! Size: " . $data['data']['size'] . " bytes\n";
}
?>
```

### Using cURL
```php
<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/screenshot?url=https://example.com&fullPage=true');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data['success']) {
    $imageData = base64_decode($data['data']['image']);
    file_put_contents('screenshot.png', $imageData);
    echo "Screenshot generated in " . $data['metadata']['processingTime'];
}
?>
```

---

## cURL (Command Line)

### Basic Screenshot
```bash
curl "http://localhost:3000/screenshot?url=https://example.com" | jq .
```

### Save to File
```bash
curl -s "http://localhost:3000/screenshot?url=https://example.com" \
  | jq -r '.data.image' \
  | base64 -d > screenshot.png
```

### Full Page Screenshot
```bash
curl "http://localhost:3000/screenshot?url=https://github.com&fullPage=true&width=1366&height=768"
```

### JPEG with Quality
```bash
curl "http://localhost:3000/screenshot?url=https://example.com&format=jpeg&quality=90"
```

### With Delay
```bash
curl "http://localhost:3000/screenshot?url=https://example.com&delay=2000"
```

---

## Ruby

### Using Net::HTTP
```ruby
require 'net/http'
require 'json'
require 'base64'

uri = URI('http://localhost:3000/screenshot')
params = {
  url: 'https://example.com',
  width: 1920,
  height: 1080
}
uri.query = URI.encode_www_form(params)

response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)

if data['success']
  image_data = Base64.decode64(data['data']['image'])
  File.write('screenshot.png', image_data)
  puts "Screenshot saved! Size: #{data['data']['size']} bytes"
end
```

---

## Go

### Basic Screenshot
```go
package main

import (
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
)

type Response struct {
    Success bool `json:"success"`
    Data    struct {
        Image  string `json:"image"`
        Format string `json:"format"`
        Size   int    `json:"size"`
    } `json:"data"`
}

func main() {
    url := "http://localhost:3000/screenshot?url=https://example.com"
    
    resp, err := http.Get(url)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    var data Response
    json.Unmarshal(body, &data)
    
    if data.Success {
        imageData, _ := base64.StdEncoding.DecodeString(data.Data.Image)
        ioutil.WriteFile("screenshot.png", imageData, 0644)
        fmt.Printf("Screenshot saved! Size: %d bytes\n", data.Data.Size)
    }
}
```

---

## Java

### Using HttpClient
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.nio.file.Files;
import java.nio.file.Paths;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ScreenshotAPI {
    public static void main(String[] args) throws Exception {
        String url = "http://localhost:3000/screenshot?url=https://example.com";
        
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        JsonObject json = JsonParser.parseString(response.body()).getAsJsonObject();
        
        if (json.get("success").getAsBoolean()) {
            String base64Image = json.getAsJsonObject("data")
                .get("image").getAsString();
            
            byte[] imageData = Base64.getDecoder().decode(base64Image);
            Files.write(Paths.get("screenshot.png"), imageData);
            
            System.out.println("Screenshot saved!");
        }
    }
}
```

---

## React Example

```jsx
import React, { useState } from 'react';

function ScreenshotGenerator() {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateScreenshot = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/screenshot?url=${encodeURIComponent(url)}&width=1366&height=768`
      );
      const data = await response.json();
      
      if (data.success) {
        setScreenshot(`data:image/${data.data.format};base64,${data.data.image}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={generateScreenshot} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Screenshot'}
      </button>
      
      {screenshot && (
        <img src={screenshot} alt="Screenshot" style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
}

export default ScreenshotGenerator;
```

---

## Error Handling Example

```javascript
async function captureScreenshot(url) {
  try {
    const response = await fetch(
      `http://localhost:3000/screenshot?url=${encodeURIComponent(url)}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Screenshot failed');
    }
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return {
      image: data.data.image,
      format: data.data.format,
      size: data.data.size,
      processingTime: data.metadata.processingTime
    };
    
  } catch (error) {
    if (error.message.includes('timeout')) {
      console.error('Page took too long to load');
    } else if (error.message.includes('Invalid URL')) {
      console.error('Please provide a valid URL');
    } else {
      console.error('Screenshot error:', error.message);
    }
    throw error;
  }
}

// Usage
try {
  const result = await captureScreenshot('https://example.com');
  console.log('Success! Processing time:', result.processingTime);
} catch (error) {
  console.error('Failed:', error.message);
}
```

---

## RapidAPI Integration Example

When using RapidAPI, include authentication headers:

```javascript
const response = await fetch(
  'https://screenshot-api.p.rapidapi.com/screenshot?url=https://example.com',
  {
    headers: {
      'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
      'X-RapidAPI-Host': 'screenshot-api.p.rapidapi.com'
    }
  }
);

const data = await response.json();
```

```python
import requests

headers = {
    'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
    'X-RapidAPI-Host': 'screenshot-api.p.rapidapi.com'
}

response = requests.get(
    'https://screenshot-api.p.rapidapi.com/screenshot',
    headers=headers,
    params={'url': 'https://example.com'}
)

data = response.json()
```

---

**Note**: Replace `http://localhost:3000` with your deployed API URL and add RapidAPI headers when using the marketplace.
