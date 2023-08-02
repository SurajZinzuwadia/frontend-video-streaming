
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
                    sh 'docker build -t krishnap1999/video-streaming-platform:latest .'
                    sh 'docker tag krishnap1999/video-streaming-platform:latest krishnap1999/video-streaming-platform:frontend'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('database') {
                    sh 'docker build -t krishnap1999/video-streaming-platform:latest .'
                    sh 'docker tag krishnap1999/video-streaming-platform:latest krishnap1999/video-streaming-platform:backend'
                }
            }
        }

        stage('push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'vss-docker-key', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR')]) {
                    sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW'
                    sh 'docker push krishnap1999/video-streaming-platform:frontend'
                    sh 'docker push krishnap1999/video-streaming-platform:backend'
                }
            }
        }

        stage('Deploy') {
                steps {
                    sh 'docker-compose -f docker-compose.yaml down'
                    sh 'docker-compose -f docker-compose.yaml up -d'
                    sh 'docker-compose ps'
                }
            }
    }

        post {
            always {
                sh 'docker logout'
            }
        }
}
