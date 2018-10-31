function ExplosionConfetti(options){
	// default
	var _options = {
		amount: 10,
		rate: 2,
		radius: 600,
		areaWidth: 500,
		areaHeight: 500,
		fallingHeight: 500,
		fallingSpeed: 1,
		colors: [0xffffff, 0xff0000, 0xffff00]
	};
	if(options) _options = DObject.merge(options, _options);

	var scope = this;
	scope.options = _options;
	scope.particles = [];
	scope.booms = [];
	scope.options.rate = scope.options.rate / 100;
	if(scope.options.rate > 0.2) scope.options.rate = 0.2;

	this.object = new THREE.Object3D();

	var geometry = new THREE.PlaneBufferGeometry(1, 1);
	var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );

	this.init = function(){
		// setInterval(scope.explode, 1000);
	};

	this.explode = function(){
		// console.log("explode");
		var boom = new THREE.Object3D();
		boom.life = DMath.randomFromTo(500, 500);
		boom.position.x = -(scope.options.areaWidth/2) + scope.options.areaWidth * Math.random();
		boom.position.y = scope.options.fallingHeight + DMath.randomPlusMinus(100);
		boom.position.z = -(scope.options.areaWidth/2) + scope.options.areaWidth * Math.random();
		scope.object.add(boom);

		scope.booms.push(boom);

		for(var i=0; i<scope.options.amount; i++){
			var material = new THREE.MeshBasicMaterial( {color: DArray.getRandom(scope.options.colors), transparent: true, side: THREE.DoubleSide} );
			var particle = new THREE.Mesh( geometry, material );
			boom.add( particle );

			particle.life = 1;

			particle.destination = {};
			particle.destination.x = ( Math.random() - 0.5) * (scope.options.radius*2) * Math.random();
			particle.destination.y = ( Math.random() - 0.5) * (scope.options.radius*2) * Math.random();
			particle.destination.z = ( Math.random() - 0.5) * (scope.options.radius*2) * Math.random();

			particle.rotation.x = DMath.random(360);
			particle.rotation.y = DMath.random(360);
			particle.rotation.z = DMath.random(360);

			var size = DMath.randomFromTo(2, 5);
			particle.scale.x = size;
			particle.scale.y = size;

			particle.rotateSpeedX = DMath.randomPlusMinus(0.4);
			particle.rotateSpeedY = DMath.randomPlusMinus(0.4);
			particle.rotateSpeedZ = DMath.randomPlusMinus(0.4);
		}

		boom.dispose = function(){
			for(var i=0; i < boom.children.length; i++){
				var particle = boom.children[i];
				particle.material.dispose();
				particle.geometry.dispose();
				boom.remove( particle );
				particle = null;
			}
			boom.parent.remove( boom );
			boom = null;
		};
	};

	this.update = function(){
		if(Math.random() < scope.options.rate) scope.explode();

		for(var i=0; i < scope.booms.length; i++){
			var boom = scope.booms[i];
			
			for(var k=0; k < boom.children.length; k++){
				var particle = boom.children[k];

				particle.destination.y -= DMath.randomFromTo(3,6);
				particle.life -= DMath.randomFromTo(0.005, 0.01);

				var speedX = (particle.destination.x - particle.position.x) / 80;
				var speedY = (particle.destination.y - particle.position.y) / 80;
				var speedZ = (particle.destination.z - particle.position.z) / 80;

				particle.position.x += speedX;
				particle.position.y += speedY;
				particle.position.z += speedZ;

				particle.rotation.y += particle.rotateSpeedY;
				particle.rotation.x += particle.rotateSpeedX;
				particle.rotation.z += particle.rotateSpeedZ;

				// particle.material.opacity -= DMath.randomFromTo(0.005, 0.01);

				if(particle.position.y < -scope.options.fallingHeight){
					particle.material.dispose();
					particle.geometry.dispose();
					boom.remove(particle);
					particle = null;
				}
			}

			if(boom.children.length <= 10){
				boom.dispose();
				scope.booms = DArray.remove(boom, scope.booms);
			}
			
		}
	};

	this.dispose = function(){
		for(var i=0; i<scope.particles.length; i++){
			var particle = scope.particles[i];
			particle.material.dispose();
			particle.geometry.dispose();
			scope.object.remove( particle );
			particle = null;
		}
		scope.object.parent.remove( scope.object );
		scope.object = null;
		scope.update = function(){};
	};

	return this;
}