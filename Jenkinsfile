
pipeline
{

	agent any

	environment {
		DOCKERHUB_CREDENTIALS=credentials('vss-docker-key')
	}

	stages 
    {
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t krishnap1999/video-streaming-platform/frontend:latest .'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('database') {
                    sh 'docker build -t krishnap1999/video-streaming-platform/backend:latest .'
                }
            }
        }

		stage('Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'vss-docker-key', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR')]) {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

		stage('Push') {

			steps {
                    sh 'docker push krishnap1999/video-streaming-platform/frontend:latest'
                    sh 'docker push krishnap1999/video-streaming-platform/backend:latest'
			}
		}	

        stage('Deploy') {
                steps {
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
    }

        post {
            always {
                sh 'docker-compose -f docker-compose.yml down'
                sh 'docker logout'
            }
        }
}
