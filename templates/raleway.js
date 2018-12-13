var Raleway = function (mesh) {
    var mesh, texture, material, topTagline, mainTagline, captionTagline,
        paragraphText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        bgFillColor = "#078ac3",
        bgRectangle,
        logo;

    init(mesh);

    return {
        mesh,
        texture,
        material,
        addImage,
        updateTemplate,
        download
    };

    function init(meshToCopy) {
        var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);

        bgRectangle = new Path2D();
        bgRectangle.rect(20, 525, 40, 4);

        texture = backgroundTexture;
        updateTemplate();
        addImage(null);

        var dynamicMaterial = new BABYLON.StandardMaterial('mat', scene);
        dynamicMaterial.diffuseTexture = backgroundTexture;
        dynamicMaterial.opacityTexture = backgroundTexture;
        // dynamicMaterial.diffuseTexture.invertZ = true;
        // dynamicMaterial.diffuseTexture.vAng = 1;
        // dynamicMaterial.diffuseTexture.wAng = BABYLON.Tools.ToRadians(90)/backgroundTexture.uScale;
        dynamicMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        dynamicMaterial.clearColor = new BABYLON.Color4(1, 0, 0, 0);
        dynamicMaterial.backFaceCulling = false;

        meshCopy = meshToCopy.clone('outer');
        meshCopy.material = dynamicMaterial;

        mesh = meshCopy;
        texture = backgroundTexture;
        material = dynamicMaterial;
    }

    function addImage(image) {
        var backgroundTexture = texture;
        var img = new Image();

        if (image !== null) {
            img.src = URL.createObjectURL(image);
        } else {
            img.src = 'logo-placeholder-1.png';
        }
        img.onload = function () {
            logo = this;
            //Add image to dynamic texture
            backgroundTexture.getContext().drawImage(this, 820, 375, 180, 160);
            /* 
            // get the image data object
            var image = backgroundTexture.getContext().getImageData(820, 375, 180, 160);
            // get the image data values 
            var imageData = image.data,
                length = imageData.length;
            // set every fourth value to 50
            for (var i = 3; i < length; i += 4) {
                imageData[i] = 50;
            }
            // after the manipulation, reset the data
            image.data = imageData;
            // and put the imagedata back to the canvas
            backgroundTexture.getContext().putImageData(image, 820, 375); */

            backgroundTexture.update();
        }
    }

    function updateTemplate(top = "2018", mainText = "Lorem", caption = "Ipsum", paragraph = paragraphText, fillColor = "#078ac3") {
        if (material) {
            texture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
            material.diffuseTexture = texture;
            material.opacityTexture = texture;
        }

        var backgroundTexture = texture;

        bgFillColor = fillColor;
        topTagline = top;
        captionTagline = caption;
        mainTagline = mainText;
        paragraphText = paragraph;

        if (logo) {
            backgroundTexture.getContext().drawImage(logo, 820, 375, 180, 160);
        }

        backgroundTexture.getContext().fillStyle = fillColor;
        backgroundTexture.getContext().fill(bgRectangle);

        backgroundTexture.drawText(topTagline.toUpperCase(), 20, 360, "32px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText(mainTagline.toUpperCase(), 20, 430, "800 75px 'Raleway'", bgFillColor, null, true);
        backgroundTexture.drawText(captionTagline.toUpperCase(), 20, 500, "800 75px 'Roboto Condensed'", "white", null, true);
        wrapText(backgroundTexture, paragraph, 20, 565, 300, 15);

        backgroundTexture.update();
        // rotate(outerCylinder);
    }

    function wrapText(backgroundTexture, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        backgroundTexture.drawText(line, x, y, "16px 'Roboto Condensed'", "white", null, true);

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = backgroundTexture.getContext().measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
                backgroundTexture.drawText(line, x, y, "16px 'Roboto Condensed'", "white", null, true);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        backgroundTexture.drawText(line, x, y, "16px 'Roboto Condensed'", "white", null, true);
    }

    function download(generateCanvas) {
        var tempImage = new Image;

        backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);

        backgroundTexture.getContext().fillStyle = bgFillColor;
        backgroundTexture.getContext().fill(bgRectangle);

        backgroundTexture.drawText(topTagline.toUpperCase(), 20, 360, "32px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText(mainTagline.toUpperCase(), 20, 430, "800 75px 'Raleway'", bgFillColor, null, true);
        backgroundTexture.drawText(captionTagline.toUpperCase(), 20, 500, "800 75px 'Roboto Condensed'", "white", null, true);
        wrapText(backgroundTexture, paragraphText, 20, 565, 300, 15);

        if (logo) {
            backgroundTexture.getContext().drawImage(logo, 640, 375, 135, 130);
        }
        /* // get the image data object
                    var image = backgroundTexture.getContext().getImageData(640, 375, 135, 130);
                    // get the image data values 
                    var imageData = image.data,
                        length = imageData.length;
                    // set every fourth value to 50
                    for (var i = 3; i < length; i += 4) {
                        imageData[i] = 50;
                    }
                    // after the manipulation, reset the data
                    image.data = imageData;
                    // and put the imagedata back to the canvas
                    backgroundTexture.getContext().putImageData(image, 640, 375); */

        backgroundTexture.update();

        tempImage.src = backgroundTexture.getContext().canvas.toDataURL("image/png");

        tempImage.onload = function () {
            //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
            if ("download" in document.createElement("a")) {
                var a = window.document.createElement("a");
                mergeImages(['/good_air_can_large.png', tempImage.src])
                    .then((b64) => {
                        a.href = b64
                        a.setAttribute("download", "dynamictexture.png");

                        window.document.body.appendChild(a);

                        a.addEventListener("click", function () {
                            a.parentElement.removeChild(a);
                        });
                        a.click();
                    });

                //Or opening a new tab with the image if it is not possible to automatically start download.
            } else {
                var newWindow = window.open("");
                var img = newWindow.document.createElement("img");
                img.src = imageurl;
                newWindow.document.body.appendChild(img);
            }
        }
    }
};