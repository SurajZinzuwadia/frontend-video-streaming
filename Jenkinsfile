
pipeline{

	agent any

	environment {
		DOCKERHUB_CREDENTIALS=credentials('vss-docker-key')
	}

	stages {

		stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        // stage('Tag and Push') {
        //     steps {
        //         sh 'docker tag krishnap1999/video-streaming-platform/frontend:latest krishnap1999/video-streaming-platform/frontend:1.0'
        //         sh 'docker tag krishnap1999/video-streaming-platform/backend:latest krishnap1999/video-streaming-platform/backend:1.0'
        //         sh 'docker tag krishnap1999/video-streaming-platform/nginx:latest krishnap1999/video-streaming-platform/nginx:1.0'
        //         sh 'docker push krishnap1999/video-streaming-platform/frontend:1.0'
        //         sh 'docker push krishnap1999/video-streaming-platform/backend:1.0'
        //         sh 'docker push krishnap1999/video-streaming-platform/nginx:latest:1.0'
        //     }
        // }

        // stage('Deploy') {
        //     steps {
        //         sh 'docker-compose up -d'
        //     }
        // }

		stage('Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'vss-docker-key', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR')]) {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

		stage('Push') {

			steps {
				sh 'docker push krishnap1999/video-streaming-platform:latest'
			}
		}
		stage('Stop and Remove old Container') {
            steps {
                sh 'docker stop video-streaming-container || true'
                sh 'docker rm video-streaming-container || true'
            }
        }
        stage('Run Image') {

			steps {
				sh 'docker run -d -p 8081:8081 --name video-streaming-container krishnap1999/video-streaming-platform:latest'
			}
		}
	}

	post {
		always {
			sh 'docker logout'
		}
	}

}