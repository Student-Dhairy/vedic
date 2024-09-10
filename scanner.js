function domReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    let scannerRunning = true;  // Flag to control scanning

    // Function when QR code is successfully scanned
    function onScanSuccess(decodeText, decodeResult) {
        if (scannerRunning) {
            // Stop the scanner
            scannerRunning = false;

            // Display the result in the custom alert box
            showCustomAlert("Your QR Code is: " + decodeText);

            // Send the QR code data to Flask API
            fetch('/process-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ qr_data: decodeText })
            })
            .then(response => response.json())  // Get the response from Flask API
            .then(data => {
                showCustomAlert("Response from Flask API: " + data.message);  // Display the API response in the modal
            })
            .catch(error => {
                console.error('Error:', error);
            });

            // Restart the scanner after a delay (optional)
            setTimeout(() => {
                scannerRunning = true;  // Reset flag to enable scanning again
            }, 5000);  // Adjust the delay as needed
        }
    }

    // Initialize the scanner
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
