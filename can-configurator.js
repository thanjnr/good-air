  var Configurator = (function () {
      var scene, engine;

      return {
          init,
          addImageToCan,
          createCan,
          createCanLabel,
          createCustomLabel,
          updateCustomLabel,
          updateCustomCaption,
          download,
          createGUI,
          render,
          resize
      };

      function init(canvas) {
          engine = new BABYLON.Engine(canvas, true, {
              preserveDrawingBuffer: true,
              stencil: true
          });
          scene = new BABYLON.Scene(engine);
          scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
          var camera = new BABYLON.ArcRotateCamera("Camera", 5 * Math.PI / 8, 7 * Math.PI / 16, 3, BABYLON.Vector3.Zero(), scene);

          //camera.setPosition(new BABYLON.Vector3(0, 0, -1));

          // This targets the camera to scene origin
          camera.setTarget(BABYLON.Vector3.Zero());

          // This attaches the camera to the canvas
          camera.attachControl(canvas, true);

          // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
          var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
          light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
          light.specular = new BABYLON.Color3(0.8, 0.8, 0.8);
          light.groundColor = new BABYLON.Color3(1, 1, 1);

          scene.activeCamera.alpha = 0.8;

          return scene;
      }

      function render() {
          engine.runRenderLoop(function () {
              if (scene) {
                  scene.render();
              }
          });
      }

      function resize() {
          engine.resize();
      }

      function createCan() {
          var skull;
          var skullMaterial = new BABYLON.StandardMaterial("skullmat", scene);
          skullMaterial.backFaceCulling = false;
          skullMaterial.alpha = 0;

          var transparentMaterial = new BABYLON.StandardMaterial("transparentMat", scene);
          transparentMaterial.backFaceCulling = false;
          transparentMaterial.alpha = 0.5;

          var hiddenMaterial = new BABYLON.StandardMaterial("hiddenMat", scene);
          hiddenMaterial.backFaceCulling = false;
          hiddenMaterial.alpha = 0;

          // The first parameter can be used to specify which mesh to import. Here we import all meshes
          BABYLON.SceneLoader.ImportMesh("", "/scenes/", "Spraycan.babylon", scene, function (newMeshes) {
              console.log(newMeshes);
              for (let i = 0; i < newMeshes.length; i++) {
                  // i = 0 can top
                  // i = 1 can nozzle
                  // i = 2 can inner lid
                  // i = 3 can nozzle tip
                  // i = 4 can outer lid
                  if (i === 3) {
                      newMeshes[i].material = hiddenMaterial;
                  }
                  if (i === 4 || i === 1) {
                      // newMeshes[i].material = transparentMaterial; 
                  }
                  newMeshes[i].scaling.x = 0.5;
                  newMeshes[i].scaling.y = 0.415;
                  newMeshes[i].scaling.z = 0.5;
                  newMeshes[i].position.y = 0.95;
                  //newMeshes[i].material = skullMaterial; 
                  //newMeshes[i].diffuseColor.copyFrom({ r:255, g:0, b:0 }); 
              }
              skull = newMeshes[0];
          });
      }

      function createCanLabel() {
          var canMaterial = new BABYLON.StandardMaterial("material", scene);
          canMaterial.diffuseTexture = new BABYLON.Texture("good_air_can_large.png", scene)

          var faceUV = [
              new BABYLON.Vector4(0, 0, 0, 0),
              new BABYLON.Vector4(1, 0, 0, 1),
              new BABYLON.Vector4(0, 0, 0, 0)
          ];

          var faceColors = [new BABYLON.Color4(0.5, 0.5, 0.5, 1)];

          var innerCylinder = BABYLON.MeshBuilder.CreateCylinder("can", {
              height: 2.60,
              faceUV: faceUV,
              faceColors: faceColors,
              tessellation: 120
          }, scene);
          innerCylinder.material = canMaterial;

          return innerCylinder;
      }

      function createCustomLabel(innerCylinder) {
          var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
          backgroundTexture.wAng = BABYLON.Tools.ToRadians(270) / backgroundTexture.uScale;
          backgroundTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);


          var rectangle = new Path2D();
          rectangle.rect(0, 200, 1200, 140);
          backgroundTexture.getContext().fillStyle = "#078ac3";
          backgroundTexture.getContext().fill(rectangle);
          backgroundTexture.update();

          backgroundTexture.drawText("ENTER TEXT", 250, 270, "bold 70px helvetica", "white", null, true);

          backgroundTexture.drawText("caption this type", 250, 300, "bold 30px arial", "white", null, true);
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

      function createHorizontalCustomLabel(innerCylinder) {
          var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);

          var rectangle = new Path2D();
          rectangle.rect(30, 270, 1200, 70);
          backgroundTexture.getContext().fillStyle = "#078ac3";
          backgroundTexture.getContext().fill(rectangle);
          backgroundTexture.update();

          backgroundTexture.drawText("Enter text", 40, 330, "normal 70px zombilariaregular", "white", null, true);
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

      function addImageToCan(image, customLabel) {
          if (image !== null) {
              console.log(image);
              var img = new Image();
              img.src = URL.createObjectURL(image);

              img.onload = function () {
                  console.log(this);
                  //Add image to dynamic texture
                  customLabel.texture.getContext().drawImage(this, 400, 820, 250, 175);

                 /*  // get the image data object
                  var image = customLabel.texture.getContext().getImageData(400, 820, 250, 175);
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
                  customLabel.texture.getContext().putImageData(image, 400, 820); */

                  customLabel.texture.update();

                  var dynamicMaterial = customLabel.material;
                  dynamicMaterial.diffuseTexture = customLabel.texture;
                  dynamicMaterial.opacityTexture = customLabel.texture;

                  var outerCylinder = customLabel.cylinder;
                  outerCylinder.material = dynamicMaterial;
              }
          }

          return customLabel;

      }

      function updateCustomLabel(text, customLabel) {
          var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
          backgroundTexture.wAng = BABYLON.Tools.ToRadians(270) / backgroundTexture.uScale;
          backgroundTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);

          var rectangle = new Path2D();
          rectangle.rect(0, 200, 1200, 140);
          backgroundTexture.getContext().fillStyle = "#078ac3";
          backgroundTexture.getContext().fill(rectangle);
          backgroundTexture.update();

          backgroundTexture.drawText(text, 250, 270, "bold 70px helvetica", "white", null, true);

          backgroundTexture.drawText("caption this type", 250, 300, "bold 30px arial", "white", null, true);

          var dynamicMaterial = customLabel.material;
          dynamicMaterial.diffuseTexture = backgroundTexture;
          dynamicMaterial.opacityTexture = backgroundTexture;

          var outerCylinder = customLabel.cylinder;
          outerCylinder.material = dynamicMaterial;

          return {
              cylinder: outerCylinder,
              texture: backgroundTexture,
              material: dynamicMaterial
          };
      }

      function updateCustomCaption(mainText, caption, customLabel) {
        var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 1024, scene, true);
        backgroundTexture.wAng = BABYLON.Tools.ToRadians(270) / backgroundTexture.uScale;
        backgroundTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var rectangle = new Path2D();
        rectangle.rect(0, 200, 1200, 140);
        backgroundTexture.getContext().fillStyle = "#078ac3";
        backgroundTexture.getContext().fill(rectangle);
        backgroundTexture.update();

        backgroundTexture.drawText(mainText, 250, 270, "bold 70px helvetica", "white", null, true);

        backgroundTexture.drawText(caption, 250, 300, "bold 30px arial", "white", null, true);

        var dynamicMaterial = customLabel.material;
        dynamicMaterial.diffuseTexture = backgroundTexture;
        dynamicMaterial.opacityTexture = backgroundTexture;

        var outerCylinder = customLabel.cylinder;
        outerCylinder.material = dynamicMaterial;

        return {
            cylinder: outerCylinder,
            texture: backgroundTexture,
            material: dynamicMaterial
        };
    }

      function download(generateCanvas, backgroundTexture) {
          var tempImage = new Image;
          tempImage.src = backgroundTexture.getContext().canvas.toDataURL("image/png");

          tempImage.onload = function () {
              generateCanvas.width = 300;
              generateCanvas.height = 960;
              /* generateCanvas.getContext("2d").translate(793, 793 / 793);
              generateCanvas.getContext("2d").rotate(Math.PI / 2);
              //generateCanvas.getContext("2d").drawImage(tempImage, 0, 0);

              generateCanvas.getContext("2d").translate(960, 793 / 960);
              generateCanvas.getContext("2d").rotate(Math.PI / 2);
              //generateCanvas.getContext("2d").drawImage(tempImage, 0, 0);

              generateCanvas.getContext("2d").translate(793, 960 / 793);
              generateCanvas.getContext("2d").rotate(Math.PI / 2); */
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
          /// rotate canvas context
          // tempCtx.rotate(0.5 * Math.PI); /// 90deg clock-wise
      }

      function createGUI(canMaterial, customLabel, downLoadCallback) {
          // GUI
          var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

          var panel = new BABYLON.GUI.StackPanel();
          panel.width = "200px";
          panel.isVertical = true;
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
          panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          advancedTexture.addControl(panel);

          var textBlock = new BABYLON.GUI.TextBlock();
          textBlock.text = "Diffuse color:";
          textBlock.height = "30px";
          panel.addControl(textBlock);

          var picker = new BABYLON.GUI.ColorPicker();
          picker.value = canMaterial.diffuseColor;
          picker.height = "150px";
          picker.width = "150px";
          picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          picker.onValueChangedObservable.add(function (value) { // value is a color3
              canMaterial.diffuseColor.copyFrom(value);
          });

          var input = new BABYLON.GUI.InputText();
          input.width = 1;
          input.maxWidth = 1;
          input.height = "40px";
          input.text = "Enter custom text";
          input.color = "white";
          input.background = "green";

          input.onTextChangedObservable.add(function (value) { // value is a color3    
              updateCustomLabel(value.text, customLabel);

          });
          panel.addControl(input);
          panel.addControl(picker);

          var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Download");
          button.width = 1;
          button.height = "40px";
          button.color = "white";
          button.background = "green";

          button.onPointerClickObservable.add(downLoadCallback);
          panel.addControl(button);
      }
  }());