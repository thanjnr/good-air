var Raleway = function (mesh) {
    var mesh, texture, material, mainTagline, captionTagline, bgFillColor = "#078ac3",
        bgRectangle;

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

    function resetMaterial() {
        material = new BABYLON.StandardMaterial('mat', scene);
        material.diffuseTexture = texture;
        material.opacityTexture = texture;
        // material.diffuseTexture.invertZ = true;
        // material.diffuseTexture.vAng = 1;
        // material.diffuseTexture.wAng = BABYLON.Tools.ToRadians(90)/backgroundTexture.uScale;
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.clearColor = new BABYLON.Color4(1, 0, 0, 0);
        material.backFaceCulling = false;

        mesh = mesh.clone('outer');
        mesh.material = material;
    }

    function addImage(image) {
        var backgroundTexture = texture;

        if (image !== null) {
            var img = new Image();
            img.src = URL.createObjectURL(image);
            logo = URL.createObjectURL(image);

            img.onload = function () {
                //Add image to dynamic texture
                backgroundTexture.getContext().drawImage(this, 820, 375, 180, 160);

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
                backgroundTexture.getContext().putImageData(image, 820, 375);

                backgroundTexture.update();
            }
        }
    }

    function updateTemplate(mainText = "Lorem", caption = "Ipsum", fillColor = "#078ac3") {
        if (material) {
            texture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
            material.diffuseTexture = texture;
            material.opacityTexture = texture;
        }

        var backgroundTexture = texture;

        bgFillColor = fillColor;
        backgroundTexture.getContext().fillStyle = fillColor;
        backgroundTexture.getContext().fill(bgRectangle);
        backgroundTexture.update();

        captionTagline = caption;
        backgroundTexture.drawText(caption.toUpperCase(), 20, 360, "32px 'Roboto Condensed'", "white", null, true);

        mainTagline = mainText;
        backgroundTexture.drawText(mainText.toUpperCase(), 20, 430, "800 75px 'Raleway'", fillColor, null, true);

        mainTagline = mainText;
        backgroundTexture.drawText(caption.toUpperCase(), 20, 500, "800 75px 'Roboto Condensed'", "white", null, true);

        backgroundTexture.drawText('Lorem Ipsum is simply dummy text of the', 20, 565, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('printing and typesetting. Lorem Ipsum', 20, 580, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('has been the industry\'s text ever', 20, 595, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('since the 1500s ', 20, 610, "16px 'Roboto Condensed'", "white", null, true);

        backgroundTexture.update();
        // rotate(outerCylinder);
    }

    function download(generateCanvas) {
        var tempImage = new Image;

        backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);

        backgroundTexture.getContext().fillStyle = bgFillColor;
        backgroundTexture.getContext().fill(bgRectangle);
        backgroundTexture.update();

        backgroundTexture.drawText(captionTagline.toUpperCase(), 20, 360, "32px 'Roboto Condensed'", "white", null, true);

        backgroundTexture.drawText(mainTagline.toUpperCase(), 20, 430, "800 75px 'Raleway'", bgFillColor, null, true);

        backgroundTexture.drawText(captionTagline.toUpperCase(), 20, 500, "800 75px 'Roboto Condensed'", "white", null, true);

        backgroundTexture.drawText('Lorem Ipsum is simply dummy text of the', 20, 565, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('printing and typesetting. Lorem Ipsum', 20, 580, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('has been the industry\'s text ever', 20, 595, "16px 'Roboto Condensed'", "white", null, true);
        backgroundTexture.drawText('since the 1500s ', 20, 610, "16px 'Roboto Condensed'", "white", null, true);

        var img = new Image();
        img.src = logo;
        img.onload = function () {
            //Add image to dynamic texture            
            backgroundTexture.getContext().drawImage(this, 640, 375, 135, 130);

            // get the image data object
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
            backgroundTexture.getContext().putImageData(image, 640, 375);

            backgroundTexture.update();

            tempImage.src = backgroundTexture.getContext().canvas.toDataURL("image/png");

            tempImage.onload = function () {
                //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
                if ("download" in document.createElement("a")) {
                    var a = window.document.createElement("a");
                    mergeImages(['/good_air_can_large.png', tempImage.src])
                        .then((b64) => {
                            console.log(b64);
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
        /// rotate canvas context
        // tempCtx.rotate(0.5 * Math.PI); /// 90deg clock-wise
    }
};