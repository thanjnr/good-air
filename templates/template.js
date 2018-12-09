var ArchivoTemplate = function (mesh) {
    var mesh, texture, material, mainTagline, captionTagline, bgFillColor = "#078ac3", bgRectangle;

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
        backgroundTexture.wAng = BABYLON.Tools.ToRadians(270) / backgroundTexture.uScale;
        backgroundTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        
        bgRectangle = new Path2D();
        bgRectangle.rect(0, 200, 1200, 122);

        texture = backgroundTexture;
        backgroundTexture = updateTemplate();

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

    function createHorizontalCustomLabel(innerCylinder) {
        var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);

        var rectangle = new Path2D();
        rectangle.rect(30, 270, 1200, 70);
        backgroundTexture.getContext().fillStyle = "#078ac3";
        backgroundTexture.getContext().fill(rectangle);
        backgroundTexture.update();

        backgroundTexture.drawText("Enter text", 40, 330, "normal 72px Archivo Black", "white", null, true);
        var dynamicMaterial = new BABYLON.StandardMaterial('mat', scene);
        dynamicMaterial.diffuseTexture = backgroundTexture;
        dynamicMaterial.opacityTexture = backgroundTexture;
        // dynamicMaterial.diffuseTexture.invertZ = true;
        // dynamicMaterial.diffuseTexture.vAng = 1;
        // dynamicMaterial.diffuseTexture.wAng = BABYLON.Tools.ToRadians(90)/backgroundTexture.uScale;
        dynamicMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        dynamicMaterial.clearColor = new BABYLON.Color4(1, 0, 0, 0);
        dynamicMaterial.backFaceCulling = false;

        outerCylinder = innerCylinder.clone('outer');
        outerCylinder.material = dynamicMaterial;

        return {
            cylinder: outerCylinder,
            texture: backgroundTexture,
            material: dynamicMaterial
        };
    }

    function addImage(image) {
        var backgroundTexture = texture;

        if (image !== null) {
            var img = new Image();
            img.src = URL.createObjectURL(image);
            logo = URL.createObjectURL(image);

            img.onload = function () {
                //Add image to dynamic texture
                backgroundTexture.getContext().drawImage(this, 400, 820, 250, 175);

                 // get the image data object
                 var image = backgroundTexture.getContext().getImageData(400, 820, 250, 175);
                 // get the image data values 
                 var imageData = image.data,
                     length = imageData.length;
                 // set every fourth value to 50
                 for (var i = 3; i < length; i += 4) {
                     imageData[i] = 30;
                 }
                 // after the manipulation, reset the data
                 image.data = imageData;
                 // and put the imagedata back to the canvas
                 backgroundTexture.getContext().putImageData(image, 400, 820);

                backgroundTexture.update();
            }
        }
    }

    function updateTemplate(mainText = "Enter text", caption = "Caption this", fillColor = "#078ac3") {
        var backgroundTexture = texture;

        bgFillColor = fillColor;
        var rectangle = new Path2D();
        rectangle.rect(0, 200, 1200, 122);
        backgroundTexture.getContext().fillStyle = fillColor;
        backgroundTexture.getContext().fill(rectangle);
        backgroundTexture.update();

        mainTagline = mainText;
        backgroundTexture.drawText(mainText.toUpperCase(), 250, 270, "70px 'Archivo Black'", "white", null, true);

        captionTagline = caption;
        backgroundTexture.drawText(caption.toUpperCase(), 250, 300, "32px 'Archivo Narrow'", "white", null, true);
    }

    function download(generateCanvas) {
        var tempImage = new Image;

        backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
        backgroundTexture.wAng = BABYLON.Tools.ToRadians(270) / backgroundTexture.uScale;
        backgroundTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);


        var rectangle = new Path2D();
        rectangle.rect(0, 150, 1200, 120);
        backgroundTexture.getContext().fillStyle = bgFillColor;
        backgroundTexture.getContext().fill(rectangle);
        backgroundTexture.update();
        
        backgroundTexture.drawText(mainTagline, 250, 220, "70px 'Archivo Black'", "white", null, true);

        backgroundTexture.drawText(captionTagline, 250, 250, "32px 'Archivo Narrow'", "white", null, true);

        var img = new Image();
        img.src = logo;
        img.onload = function () {
            //Add image to dynamic texture
            backgroundTexture.getContext().drawImage(this, 400, 645, 200, 130);
            backgroundTexture.update();

            tempImage.src = backgroundTexture.getContext().canvas.toDataURL("image/png");

            tempImage.onload = function () {
                generateCanvas.width = 793;
                generateCanvas.height = 960;
                generateCanvas.getContext("2d").translate(793, 793 / 793);
                generateCanvas.getContext("2d").rotate(Math.PI / 2);
                //generateCanvas.getContext("2d").drawImage(tempImage, 0, 0);

                generateCanvas.getContext("2d").translate(960, 793 / 960);
                generateCanvas.getContext("2d").rotate(Math.PI / 2);
                //generateCanvas.getContext("2d").drawImage(tempImage, 0, 0);

                generateCanvas.getContext("2d").translate(793, 960 / 793);
                generateCanvas.getContext("2d").rotate(Math.PI / 2);
                generateCanvas.getContext("2d").drawImage(tempImage, 0, 0);

                var imageurl = generateCanvas.toDataURL("image/png");

                //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
                if ("download" in document.createElement("a")) {
                    var a = window.document.createElement("a");
                    mergeImages(['/good_air_can_large.png', imageurl])
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