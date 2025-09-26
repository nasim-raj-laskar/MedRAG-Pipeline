from setuptools import setup,find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name="RAG_bot",
    version="0.1",
    author="NASIM",
    packages=find_packages(),
    install_requires = requirements,
)